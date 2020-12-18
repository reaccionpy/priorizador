import React, { useEffect, useState, useCallback } from 'react';

import { Map, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { debounce } from 'lodash';
import GeoJsonGeometriesLookup from 'geojson-geometries-lookup';
import chroma from 'chroma-js';
import useSupercluster from 'use-supercluster';
import L from 'leaflet';
import { Sidebar, Tab } from 'react-leaflet-sidebarv2';
import '../css/sidebar-v2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faTimes,
  faMapMarkerAlt,
  faDrawPolygon,
  faMap
} from '@fortawesome/free-solid-svg-icons';
import DataSourceSelector from './DataSourceSelector';
import DistrictSelector from './DistrictSelector';
import ColorScale from './ColorScale';

const icons = {};

const fetchIcon = count => {
  if (!icons[count]) {
    icons[count] = L.divIcon({
      html: `<div class="cluster-marker">
          ${count}
        </div>`
    });
  }
  return icons[count];
};

export default function CustomMap(props) {
  const [position, setPosition] = useState([-25.513475, -54.61544]);

  const geoJsonLayer = React.useRef();

  const [glookup, setGlookup] = React.useState(null);
  const [maxColor, setMaxColor] = React.useState(1);
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(13);
  const [colorsAndQuantities, setColorsAndQuantities] = useState([]);

  const mapRef = React.useRef();
  function updateMap() {
    const b = mapRef.current.leafletElement.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat
    ]);
    setZoom(mapRef.current.leafletElement.getZoom());
  }

  useEffect(() => {
    updateMap();
  }, []);

  useEffect(() => {
    if (geoJsonLayer.current) {
      // https://github.com/PaulLeCam/react-leaflet/issues/332
      geoJsonLayer.current.leafletElement
        .clearLayers()
        .addData(props.localities);
      setMaxColor(
        Math.max(
          ...props.localities.features.map(l =>
            l.properties.dist_desc === props.district
              ? l.properties[props.colorBy] || 1
              : 1
          )
        )
      );
      setGlookup(new GeoJsonGeometriesLookup(props.localities));
    }
  }, [props.localities, props.colorBy, props.district]);

  useEffect(() => {
    const districtPositionMap = {
      'CIUDAD DEL ESTE': [-25.513475, -54.61544],
      HERNANDARIAS: [-25.40944, -54.63819],
      'MINGA GUAZU': [-25.48881, -54.80826],
      'PRESIDENTE FRANCO': [-25.57439, -54.60375]
    };
    setPosition(districtPositionMap[props.district]);
  }, [props.district]);

  const clusterPoints =
    props.markersBy === 'cestas' && props.cestasEntries
      ? props.cestasEntries.features
      : [];

  const { clusters, supercluster } = useSupercluster({
    points: clusterPoints,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  const transformByVariable = useCallback(
    n => {
      return props.colorBy === 'tekopora' ? Math.log(n) : n;
    },
    [props.colorBy]
  );

  const getValue = useCallback(
    properties => {
      const def = props.colorBy === 'tekopora' ? 1 : 0;
      return properties.dist_desc === props.district
        ? properties[props.colorBy] || def
        : def;
    },
    [props.colorBy, props.district]
  );

  function getStyle(feature, layer) {
    const scale = chroma
      .scale(['#fedb8b', '#a50026'])
      .domain([transformByVariable(maxColor), 0])
      .classes(3);
    const value = getValue(feature.properties);
    const color = scale(transformByVariable(value)).hex();
    return {
      color,
      weight: 5,
      opacity: 0.65
    };
  }

  useEffect(() => {
    var allColorsAndQuantities = [];

    const getLayerColorAndQuantity = feature => {
      const scale = chroma
        .scale(['#fedb8b', '#a50026'])
        .domain([transformByVariable(maxColor), 0])
        .classes(3);
      const value = getValue(feature.properties);
      const color = scale(transformByVariable(value)).hex();

      return [color, value];
    };

    for (let i = 0; i < props.localities.features.length; i++) {
      var feature = props.localities.features[i];
      var colorAndQuantity = getLayerColorAndQuantity(feature);
      allColorsAndQuantities.push(colorAndQuantity);
    }
    setColorsAndQuantities(allColorsAndQuantities.slice());
  }, [props.localities, getValue, maxColor, transformByVariable]);

  function onMouseMove(e) {
    const point = {
      type: 'Point',
      coordinates: [e.latlng.lng, e.latlng.lat]
    };

    if (glookup) {
      const result = glookup.getContainers(point);
      const locality = result.features.length
        ? result.features[0]
        : {
            properties: { barlo_desc: ' ' }
          };
      if (locality !== props.currentLocality) {
        props.onLocalityChange(locality);
      }
    }
  }

  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState('home');
  const [showSubsidio, setShowSubsidio] = useState(true);
  const [showAyuda, setShowAyuda] = useState(true);

  const onClose = () => {
    setCollapsed(true);
  };

  const onOpen = id => {
    setCollapsed(false);
    setSelected(id);
  };

  return (
    <>
      <Sidebar
        id="sidebar"
        collapsed={collapsed}
        selected={selected}
        onOpen={onOpen.bind(this)}
        onClose={onClose.bind(this)}
        closeIcon={<FontAwesomeIcon icon={faTimes} />}
      >
        <Tab
          id="home"
          header="Filtrar"
          icon={<FontAwesomeIcon icon={faFilter} />}
        >
          <div>
            <div className="filter-container">
              <FontAwesomeIcon icon={faMap} /> Distrito <br></br>
              <DistrictSelector
                onChange={props.onDistrictChange}
                value={props.district}
              />
            </div>
            <div className="filter-container">
              <FontAwesomeIcon icon={faDrawPolygon} /> Subsidio &nbsp;
              <input
                type="checkbox"
                checked={showSubsidio}
                id="show-subsidio"
                onChange={() => setShowSubsidio(!showSubsidio)}
              />
              <br></br>
              <DataSourceSelector
                onChange={props.onSelectorChange}
                value={props.selectorValue}
                list={props.selectorList}
              />
            </div>
            <div className="filter-container">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Ayuda entregada &nbsp;
              <input
                type="checkbox"
                checked={showAyuda}
                onChange={() => setShowAyuda(!showAyuda)}
              />
              <br></br>
              <DataSourceSelector
                onChange={props.onHelpSourceChange}
                value={props.helpSourceValue}
                list={props.helpSourceList}
              />
            </div>
          </div>
        </Tab>
      </Sidebar>
      <Map
        className="sidebar-map"
        id="map"
        center={position}
        zoom={12}
        onMouseMove={debounce(onMouseMove, 200, { leading: true })}
        onMoveEnd={updateMap}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showAyuda &&
          props.markersBy === 'kobo' &&
          props.koboEntries.map((value, index) => {
            return (
              <Marker key={`kobo-${index}`} position={value.coordinates}>
                <Popup>
                  {value.organizacion && (
                    <p>
                      <strong>Organización:</strong> {value.organizacion}
                    </p>
                  )}
                  {value.nro_familias && (
                    <p>
                      <strong>Número de familias:</strong> {value.nro_familias}
                    </p>
                  )}
                  {value.tipo_ayuda && (
                    <p>
                      <strong>Tipo de ayuda:</strong> {value.tipo_ayuda}
                    </p>
                  )}
                </Popup>
              </Marker>
            );
          })}
        {showAyuda &&
          props.markersBy === 'cestas' &&
          clusters.map((cluster, index) => {
            // every cluster point has coordinates
            const [longitude, latitude] = cluster.geometry.coordinates;
            // the point may be either a cluster or a crime point
            const {
              cluster: isCluster,
              point_count: pointCount
            } = cluster.properties;

            // we have a cluster to render
            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  position={[latitude, longitude]}
                  icon={fetchIcon(pointCount)}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      17
                    );
                    const leaflet = mapRef.current.leafletElement;
                    leaflet.setView([latitude, longitude], expansionZoom, {
                      animate: true
                    });
                  }}
                />
              );
            }

            // we have a single point to render
            const {
              nombre_apellido: nombre,
              nro_ci: cedula,
              nro_telefono: telefono
            } = cluster.properties;
            return (
              <Marker key={index} position={[latitude, longitude]}>
                <Popup>
                  {nombre && (
                    <p>
                      <strong>Nombre:</strong> {nombre}
                    </p>
                  )}
                  {cedula && (
                    <p>
                      <strong>CI:</strong> {cedula.toLocaleString('es')}
                    </p>
                  )}
                  {telefono && (
                    <p>
                      <strong>Teléfono:</strong> {telefono}
                    </p>
                  )}
                </Popup>
              </Marker>
            );
          })}
        }
        {showSubsidio && (
          <GeoJSON
            data={props.localities}
            style={getStyle}
            ref={geoJsonLayer}
          />
        )}
      </Map>
      {showSubsidio && (
        <ColorScale
          colorsAndQuantities={colorsAndQuantities}
          colorBy={props.colorBy}
        />
      )}
    </>
  );
}

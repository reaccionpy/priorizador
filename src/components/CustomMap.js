import React, { useEffect, useState } from 'react';

import { Map, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { debounce } from 'lodash';
import GeoJsonGeometriesLookup from 'geojson-geometries-lookup';
import chroma from 'chroma-js';

export default function CustomMap(props) {
  const [position, setPosition] = useState([-25.513475, -54.61544]);

  const geoJsonLayer = React.useRef();

  const [glookup, setGlookup] = React.useState(null);
  const [maxColor, setMaxColor] = React.useState(1);

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

  function getStyle(feature, layer) {
    const transformByVariable = n =>
      props.colorBy === 'tekopora' ? Math.log(n) : n;

    const getValue = properties => {
      const def = props.colorBy === 'tekopora' ? 1 : 0;
      return properties.dist_desc === props.district
        ? properties[props.colorBy] || def
        : def;
    };

    const scale = chroma
      .scale('RdYlBu')
      .domain([transformByVariable(maxColor), 0]);
    const value = getValue(feature.properties);
    const color = scale(transformByVariable(value)).hex();
    return {
      color,
      weight: 5,
      opacity: 0.65
    };
  }

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

  return (
    <Map
      center={position}
      zoom={12}
      onMouseMove={debounce(onMouseMove, 200, { leading: true })}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {props.koboEntries.map((value, index) => {
        return (
          <Marker key={index} position={value.coordinates}>
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
      <GeoJSON data={props.localities} style={getStyle} ref={geoJsonLayer} />
    </Map>
  );
}

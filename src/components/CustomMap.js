import React from "react";
import { useEffect } from "react";
import { Map, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import { debounce } from "lodash";
import GeoJsonGeometriesLookup from "geojson-geometries-lookup";

export default function CustomMap(props) {
  const position = [-25.513475, -54.61544];
  const geoJsonLayer = React.createRef();

  const [glookup, setGlookup] = React.useState(null);

  useEffect(() => {
    if (geoJsonLayer.current) {
      //https://github.com/PaulLeCam/react-leaflet/issues/332
      geoJsonLayer.current.leafletElement
        .clearLayers()
        .addData(props.localities);
      setGlookup(new GeoJsonGeometriesLookup(props.localities));
    }
  }, [props.localities]);

  function getStyle(feature, layer) {
    return {
      color: "#22A9E0",
      weight: 5,
      opacity: 0.65
    };
  }

  function onMouseMove(e) {
    const point = {
      type: "Point",
      coordinates: [e.latlng.lng, e.latlng.lat]
    };

    if (glookup) {
      const result = glookup.getContainers(point);
      const locality = result.features.length
        ? result.features[0]
        : {
            properties: { barlo_desc: " " }
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
      <GeoJSON data={props.localities} style={getStyle} ref={geoJsonLayer} />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup.
          <br />
          Easily customizable.
        </Popup>
      </Marker>
    </Map>
  );
}

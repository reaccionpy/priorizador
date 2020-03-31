import React from "react";
import { useEffect } from "react";
import { Map, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";

export default function CustomMap(props) {
  const position = [-25.513475, -54.61544];
  const [localities, setLocalities] = React.useState({
    type: "FeatureCollection",
    features: []
  });

  const geoJsonLayer = React.createRef();

  useEffect(() => {
    fetch("alto_parana_2012_barrrios_y_localidades.geojson")
      .then(r => r.json())
      .then(data => {
        geoJsonLayer.current.leafletElement.clearLayers().addData(data);
        setLocalities(data);
      });
  }, [setLocalities]);

  function getStyle(feature, layer) {
    return {
      color: "#22A9E0",
      weight: 5,
      opacity: 0.65
    };
  }

  return (
    <Map center={position} zoom={12}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={localities} style={getStyle} ref={geoJsonLayer} />
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

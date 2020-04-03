import React from "react";
import { useEffect } from "react";
import "./App.css";
import { Layout } from "antd";
import CustomHeader from "./components/CustomHeader";
import CustomMap from "./components/CustomMap";
import InformationPanel from "./components/InformationPanel";
const { Header, Content } = Layout;

function App() {
  const [localities, setLocalities] = React.useState({
    type: "FeatureCollection",
    features: []
  });

  useEffect(() => {
    fetch("alto_parana_2012_barrrios_y_localidades.geojson")
      .then(r => r.json())
      .then(data => {
        setLocalities(data);
      });
  }, [setLocalities]);

  const [currentLocality, setCurrentLocality] = React.useState({
    properties: { barlo_desc: " " }
  });

  const [colorBy, setColorBy] = React.useState("tekopora");

  return (
    <div className="App">
      <Header>
        <CustomHeader onChange={setColorBy}></CustomHeader>
      </Header>

      <Content>
        <CustomMap
          localities={localities}
          locality={currentLocality}
          onLocalityChange={setCurrentLocality}
          colorBy={colorBy}
        ></CustomMap>
        <InformationPanel locality={currentLocality}></InformationPanel>
      </Content>
    </div>
  );
}

export default App;

import React, { useRef, useEffect } from 'react';

import { useMediaQuery } from 'react-responsive';
import './App.css';
import { Layout } from 'antd';
import CustomHeader from './components/CustomHeader';
import CustomMap from './components/CustomMap';
import InformationPanel from './components/InformationPanel';

const { Header, Content } = Layout;

function App() {
  const scrollInto = useRef(null);
  useEffect(() => {
    scrollInto.current.scrollIntoView();
  });

  const [localities, setLocalities] = React.useState({
    type: 'FeatureCollection',
    features: []
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/get_json?departamento=10')
      .then(r => r.json())
      .then(data => {
        setLocalities(data);
      });
  }, []);

  const [currentLocality, setCurrentLocality] = React.useState({
    properties: { barlo_desc: ' ' }
  });

  const [colorBy, setColorBy] = React.useState('tekopora');

  const [district, setDistrict] = React.useState('CIUDAD DEL ESTE');

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

  return (
    <div ref={scrollInto}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ minheight: '8vh' }}>
          <CustomHeader
            onSelectorChange={setColorBy}
            selectorValue={colorBy}
            onDistrictChange={setDistrict}
            district={district}
            showSelector={isDesktopOrLaptop}
          ></CustomHeader>
        </Header>
        <Content style={{ height: '92vh' }}>
          <CustomMap
            localities={localities}
            locality={currentLocality}
            district={district}
            onLocalityChange={setCurrentLocality}
            colorBy={colorBy}
          ></CustomMap>
          <InformationPanel
            locality={currentLocality}
            onSelectorChange={setColorBy}
            selectorValue={colorBy}
            onDistrictChange={setDistrict}
            district={district}
            showSelector={!isDesktopOrLaptop}
          ></InformationPanel>
        </Content>
      </Layout>
    </div>
  );
}

export default App;

import React, { useRef, useEffect, useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import './App.css';
import { Layout } from 'antd';
import CustomHeader from './components/CustomHeader';
import CustomMap from './components/CustomMap';
import InformationPanel from './components/InformationPanel';

const { Header, Content } = Layout;

const defaultSelectorList = [
  { title: 'Tekopora', value: 'tekopora', default: true },
  { title: 'Almuerzo escolar', value: 'almuerzo', default: false },
  { title: 'Fundación Paraguaya', value: 'fundacion', default: false },
  { title: 'Techo', value: 'techo', default: false }
];

function App() {
  const scrollInto = useRef(null);

  const [localities, setLocalities] = useState({
    type: 'FeatureCollection',
    features: []
  });
  const [selectorList, setSelectorList] = useState(defaultSelectorList);
  const [currentLocality, setCurrentLocality] = useState({
    properties: { barlo_desc: ' ' }
  });
  const [colorBy, setColorBy] = useState('tekopora');
  const [district, setDistrict] = useState('CIUDAD DEL ESTE');
  const [koboEntries, setKoboEntries] = useState([]);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

  useEffect(() => {
    scrollInto.current.scrollIntoView();
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/get_json?departamento=10`)
      .then(r => r.json())
      .then(data => {
        setLocalities(data);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/get_kobo_submissions`)
      .then(r => r.json())
      .then(data => {
        setKoboEntries(data);
      });
  }, []);

  useEffect(() => {
    const localitiesByDistrict = localities.features.filter(
      l => l.properties.dist_desc === district
    );
    let techoFound = false;
    let almuerzoFound = false;
    let fundacionFound = false;

    localitiesByDistrict.forEach(locality => {
      if (locality.properties.techo) {
        techoFound = true;
      }
      if (locality.properties.almuerzo) {
        almuerzoFound = true;
      }
      if (locality.properties.fundacion) {
        fundacionFound = true;
      }
    });

    setSelectorList(
      defaultSelectorList.filter(item => {
        if (item.value === 'tekopora') {
          return true;
        }
        if (item.value === 'almuerzo' && techoFound) {
          return true;
        }
        if (item.value === 'fundacion' && almuerzoFound) {
          return true;
        }
        if (item.value === 'techo' && fundacionFound) {
          return true;
        }
        return false;
      })
    );
  }, [district, localities.features]);

  return (
    <div ref={scrollInto}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ minheight: '8vh' }}>
          <CustomHeader
            onSelectorChange={setColorBy}
            selectorList={selectorList}
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
            koboEntries={koboEntries}
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

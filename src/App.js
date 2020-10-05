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
  //{ title: 'Tarifa social ANDE', value: 'ande', default: false }
];

const defaultHelpSourceList = [
  { title: 'Pintá con tu ayuda', value: 'kobo', default: true },
  { title: 'Cestas básicas MCDE', value: 'cestas', default: false }
];

const endpointsDict = {
  tekopora: 'get_tekopora_layer?departamento=10',
  almuerzo: 'get_almuerzo_layer?departamento=10',
  fundacion: 'get_fundacion_layer?departamento=10',
  techo: 'get_techo_layer?departamento=10'
};

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

  const [markersBy, setMarkersBy] = useState('kobo');
  const [koboEntries, setKoboEntries] = useState([]);
  const [cestasEntries, setCestasEntries] = useState([]);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

  useEffect(() => {
    scrollInto.current.scrollIntoView();
  });

  useEffect(() => {
    // fetch(`${process.env.REACT_APP_API_URL}/get_tekopora_layer?departamento=10`)
    //   .then(r => r.json())
    //   .then(data => {
    //     setLocalities(data);
    //   });
    // fetch(`${process.env.REACT_APP_API_URL}/get_fundacion_layer?departamento=10`)
    //   .then(r => r.json())
    //   .then(data => {
    //     setLocalities(data);
    //   });
    // fetch(`${process.env.REACT_APP_API_URL}/get_almuerzo_layer?departamento=10`)
    //   .then(r => r.json())
    //   .then(data => {
    //     setLocalities(data);
    //   });
    // fetch(`${process.env.REACT_APP_API_URL}/get_techo_layer?departamento=10`)
    //   .then(r => r.json())
    //   .then(data => {
    //     setLocalities(data);
    //   });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/get_kobo_submissions`)
      .then(r => r.json())
      .then(data => {
        setKoboEntries(data);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/get_cestas_submissions`)
      .then(r => r.json())
      .then(data => {
        setCestasEntries(data);
      });
  }, []);

  // useEffect(() => {
  //   const localitiesByDistrict = localities.features.filter(
  //     l => l.properties.dist_desc === district
  //   );
  //   let techoFound = false;
  //   let almuerzoFound = false;
  //   let fundacionFound = false;
  //   let andeFound = false;
  //
  //   localitiesByDistrict.forEach(locality => {
  //     if (locality.properties.techo) {
  //       techoFound = true;
  //     }
  //     if (locality.properties.almuerzo) {
  //       almuerzoFound = true;
  //     }
  //     if (locality.properties.fundacion) {
  //       fundacionFound = true;
  //     }
  //     if (locality.properties.ande) {
  //       andeFound = true;
  //     }
  //   });
  //
  //   setSelectorList(
  //     defaultSelectorList.filter(item => {
  //       if (item.value === 'tekopora') {
  //         return true;
  //       }
  //       if (item.value === 'almuerzo' && techoFound) {
  //         return true;
  //       }
  //       if (item.value === 'fundacion' && almuerzoFound) {
  //         return true;
  //       }
  //       if (item.value === 'techo' && fundacionFound) {
  //         return true;
  //       }
  //       if (item.value === 'ande' && andeFound) {
  //         return true;
  //       }
  //       return false;
  //     })
  //   );
  // }, [district, localities.features]);

  // Now, the selector list has the elements of defaultSelectorList, without filter
  useEffect(() => {
    setSelectorList(defaultSelectorList);
  }, [district, localities.features]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/${endpointsDict[colorBy]}`)
      .then(r => r.json())
      .then(data => {
        setLocalities(data);
      });
  }, [colorBy]);

  return (
    <div ref={scrollInto}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ minheight: '8vh' }}>
          <CustomHeader showSelector={isDesktopOrLaptop}></CustomHeader>
        </Header>
        <Content style={{ height: '92vh' }}>
          <CustomMap
            onSelectorChange={setColorBy}
            selectorList={selectorList}
            selectorValue={colorBy}
            onDistrictChange={setDistrict}
            district={district}
            showSelector={isDesktopOrLaptop}
            helpSourceList={defaultHelpSourceList}
            onHelpSourceChange={setMarkersBy}
            helpSourceValue={markersBy}
            localities={localities}
            locality={currentLocality}
            onLocalityChange={setCurrentLocality}
            colorBy={colorBy}
            markersBy={markersBy}
            koboEntries={koboEntries}
            cestasEntries={cestasEntries}
          ></CustomMap>
          <InformationPanel locality={currentLocality}></InformationPanel>
        </Content>
      </Layout>
    </div>
  );
}

export default App;

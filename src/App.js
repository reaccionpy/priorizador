import React, { useRef, useEffect, useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import './App.css';
import { Layout } from 'antd';
import CustomHeader from './components/CustomHeader';
import CustomMap from './components/CustomMap';
import InformationPanel from './components/InformationPanel';
import { css } from '@emotion/core';
import PulseLoader from 'react-spinners/PulseLoader';

const { Header, Content } = Layout;

const defaultSelectorList = [
  { title: 'Tekopora', value: 'tekopora', default: true },
  { title: 'Almuerzo escolar', value: 'almuerzo', default: false },
  { title: 'Fundación Paraguaya', value: 'fundacion', default: false },
  { title: 'Techo', value: 'techo', default: false },
  { title: 'Tarifa social ANDE', value: 'ande', default: false }
];

const defaultHelpSourceList = [
  { title: 'Pintá con tu ayuda', value: 'kobo', default: true },
  { title: 'Cestas básicas MCDE', value: 'cestas', default: false }
];

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #3fa652eb;
  position: absolute;
  top: 50%;
  left: 45%;
  z-index: 1000;
`;

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
  const [isLoadingDataset, setIsLoadingDataset] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

  const handleLoadingDataset = isLoading => {
    var map = document.getElementById('map');

    setIsLoadingDataset(isLoading);

    if (isLoading) {
      map.style.opacity = '0.5';
    } else {
      map.style.opacity = '1';
    }
  };

  useEffect(() => {
    scrollInto.current.scrollIntoView();
  });

  useEffect(() => {
    handleLoadingDataset(true);

    fetch(`${process.env.REACT_APP_API_URL}/get_json?departamento=10`)
      .then(r => r.json())
      .then(data => {
        setLocalities(data);
        handleLoadingDataset(false);
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
    fetch(`${process.env.REACT_APP_API_URL}/get_cestas_submissions`)
      .then(r => r.json())
      .then(data => {
        setCestasEntries(data);
      });
  }, []);

  useEffect(() => {
    const localitiesByDistrict = localities.features.filter(
      l => l.properties.dist_desc === district
    );
    let techoFound = false;
    let almuerzoFound = false;
    let fundacionFound = false;
    let andeFound = false;

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
      if (locality.properties.ande) {
        andeFound = true;
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
        if (item.value === 'ande' && andeFound) {
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
          <CustomHeader showSelector={isDesktopOrLaptop}></CustomHeader>
        </Header>
        <Content style={{ height: '92vh' }}>
          <PulseLoader
            css={override}
            size={50}
            color={'#3fa652eb'}
            loading={isLoadingDataset}
          />
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

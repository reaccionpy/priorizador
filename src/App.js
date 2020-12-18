import React, { useRef, useEffect, useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import './App.css';
import { Layout } from 'antd';
import CustomHeader from './components/CustomHeader';
import CustomMap from './components/CustomMap';
import InformationPanel from './components/InformationPanel';
import { css } from '@emotion/core';
import PulseLoader from 'react-spinners/PulseLoader';
import localforage from 'localforage';
import moment from 'moment';

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

const endpoints_dict = {
  tekopora: 'get_tekopora_layer?departamento=10',
  almuerzo: 'get_almuerzo_layer?departamento=10',
  fundacion: 'get_fundacion_layer?departamento=10',
  techo: 'get_techo_layer?departamento=10',
  ande: 'get_ande_layer?departamento=10'
};

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

  // Now, the selector list has the elements of defaultSelectorList, without filter
  useEffect(() => {
    setSelectorList(defaultSelectorList);
  }, [district, localities.features]);

  useEffect(() => {
    handleLoadingDataset(true);
    /* if the layer has been loaded and saved before (no more than 7 days),
    it is not necessary to load it again, it can be reused
    */
    localforage.getItem(colorBy).then(layer_data => {
      // calculate the time difference between the current datetime and the
      // moment when de data was saved
      if (layer_data != null) {
        const now = moment().toDate();
        const stored_time = layer_data['stored_time'];
        const duration_stored_data = moment(now).diff(stored_time, 'days');
        if (layer_data['data'] == null || duration_stored_data >= 7) {
          fetch(`${process.env.REACT_APP_API_URL}/${endpoints_dict[colorBy]}`)
            .then(r => r.json())
            .then(data => {
              setLocalities(data);
              handleLoadingDataset(false);
              // save the layer data and current time
              const now = moment().toDate();
              const data_and_saved_time = {
                data: data,
                stored_time: now
              };
              localforage.setItem(colorBy, data_and_saved_time);
            });
        } else {
          // use the saved layer data
          setLocalities(layer_data['data']);
          handleLoadingDataset(false);
        }
      } else {
        fetch(`${process.env.REACT_APP_API_URL}/${endpoints_dict[colorBy]}`)
          .then(r => r.json())
          .then(data => {
            setLocalities(data);
            handleLoadingDataset(false);
            // save the layer data and current time
            const now = moment().toDate();
            const data_and_saved_time = {
              data: data,
              stored_time: now
            };
            localforage.setItem(colorBy, data_and_saved_time);
          });
      }
    });
  }, [colorBy]);

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

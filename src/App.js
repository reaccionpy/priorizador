import React, { useRef, useEffect } from 'react';

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
  useEffect(() => {
    scrollInto.current.scrollIntoView();
  });

  const [localities, setLocalities] = React.useState({
    type: 'FeatureCollection',
    features: []
  });

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL)
      .then(r => r.json())
      .then(data => {
        setLocalities(data);
      });
  }, []);

  const [currentLocality, setCurrentLocality] = React.useState({
    properties: { barlo_desc: ' ' }
  });

  const [selectorList, setSelectorList] = React.useState(defaultSelectorList);

  const [colorBy, setColorBy] = React.useState('tekopora');

  const [district, setDistrict] = React.useState('CIUDAD DEL ESTE');

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

  const onDistrictChange = value => {
    setDistrict(value);
    switch (value) {
      case 'CIUDAD DEL ESTE':
        setSelectorList(defaultSelectorList);
        break;

      default:
        setSelectorList([
          { title: 'Tekopora', value: 'tekopora', default: true }
        ]);
        setColorBy('tekopora');
        break;
    }
  };

  return (
    <div ref={scrollInto}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ minheight: '8vh' }}>
          <CustomHeader
            onSelectorChange={setColorBy}
            selectorList={selectorList}
            selectorValue={colorBy}
            onDistrictChange={onDistrictChange}
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
            selectorList={selectorList}
            selectorValue={colorBy}
            onDistrictChange={onDistrictChange}
            district={district}
            showSelector={!isDesktopOrLaptop}
          ></InformationPanel>
        </Content>
      </Layout>
    </div>
  );
}

export default App;

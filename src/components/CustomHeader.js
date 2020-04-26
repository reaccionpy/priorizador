import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import DataSourceSelector from './DataSourceSelector';
import DistrictSelector from './DistrictSelector';

export default function CustomHeader(props) {
  return (
    <div className="header" style={{ maxHeight: '20vh' }}>
      <div className="header-title">Priorizador</div>
      <div className="header-info">
        <a
          href="https://medium.com/@d.riveros.garcia/una-propuesta-para-que-la-ayuda-covid-19-llegue-a-tantas-familias-paraguayas-como-sea-posible-8adfe1101806"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InfoCircleOutlined />
        </a>
      </div>
      {props.showSelector && (
        <div className="header-selector">
          <DistrictSelector
            onChange={props.onDistrictChange}
            value={props.district}
          />
        </div>
      )}
      {props.showSelector && (
        <div className="header-selector">
          <DataSourceSelector
            onChange={props.onSelectorChange}
            value={props.selectorValue}
            list={props.selectorList}
          />
        </div>
      )}

      <div className="header-right">
        <img
          className="header-logo"
          src={
            props.showSelector
              ? 'reaccion-logo-white.svg'
              : 'isotipo-reaccion-white.svg'
          }
          alt="Reaccion"
          style={{ height: 43 }}
        />
        <img
          className="header-logo"
          src={
            props.showSelector
              ? 'codium-logo-white.svg'
              : 'isotipo-codium-white.svg'
          }
          alt="Codium"
          style={{ height: 38 }}
        />
      </div>
    </div>
  );
}

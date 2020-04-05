import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Select } from 'antd';

const { Option } = Select;

export default function CustomHeader(props) {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  });
  return (
    <div className="header" style={{ maxHeight: '20vh' }}>
      <div className="header-title">Priorizador</div>
      {isDesktopOrLaptop && (
        <div className="header-selector">
          <Select
            defaultValue="tekopora"
            onChange={props.onChange}
            style={{ width: 180 }}
          >
            <Option value="almuerzo">Almuerzo escolar</Option>
            <Option value="fundacion">Fundación Paraguaya</Option>
            <Option value="techo">Techo</Option>
            <Option value="tekopora">Tekoporā</Option>
          </Select>
        </div>
      )}
      <div className="header-right">
        <img
          className="header-logo"
          src="reaccion2.png"
          alt="Reaccion"
          style={{ height: 50 }}
        />
        <img
          className="header-logo"
          src="codium-logo-white.svg"
          alt="Codium"
          style={{ height: 38 }}
        />
      </div>
    </div>
  );
}

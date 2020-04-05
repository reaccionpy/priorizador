import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DataSourceSelector = ({ onChange, value }) => (
  <Select
    defaultValue="tekopora"
    value={value}
    onChange={onChange}
    style={{ width: '100%' }}
  >
    <Option value="almuerzo">Almuerzo escolar</Option>
    <Option value="fundacion">Fundación Paraguaya</Option>
    <Option value="techo">Techo</Option>
    <Option value="tekopora">Tekoporā</Option>
  </Select>
);

export default DataSourceSelector;

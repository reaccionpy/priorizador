import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DistrictSelector = ({ onChange, value }) => (
  <Select
    defaultValue="CIUDAD DEL ESTE"
    value={value}
    onChange={onChange}
    style={{ width: '100%' }}
  >
    <Option value="CIUDAD DEL ESTE">Ciudad del Este</Option>
    <Option value="HERNANDARIAS">Hernandarias</Option>
    <Option value="MINGA GUAZU">Minga Guazu</Option>
    <Option value="PRESIDENTE FRANCO">Presidente Franco</Option>
  </Select>
);

export default DistrictSelector;

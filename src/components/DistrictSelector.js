import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DistrictSelector = ({ onChange, value }) => (
  <Select
    className="filter-select"
    defaultValue="CIUDAD DEL ESTE"
    value={value}
    onChange={onChange}
  >
    <Option value="CIUDAD DEL ESTE">Ciudad del Este</Option>
    <Option value="HERNANDARIAS">Hernandarias</Option>
    <Option value="MINGA GUAZU">Minga Guazu</Option>
    <Option value="PRESIDENTE FRANCO">Presidente Franco</Option>
  </Select>
);

export default DistrictSelector;

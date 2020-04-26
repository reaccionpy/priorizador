import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const renderOption = it => {
  return <Option value={it.value}>{it.title}</Option>;
};

const DataSourceSelector = ({ onChange, value, list }) => (
  <Select
    defaultValue="tekopora"
    value={value}
    onChange={onChange}
    style={{ width: '100%' }}
  >
    {list.map(renderOption)}
  </Select>
);

export default DataSourceSelector;

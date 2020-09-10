import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const renderOption = it => {
  return (
    <Option key={it.value} value={it.value}>
      {it.title}
    </Option>
  );
};

const DataSourceSelector = ({ onChange, value, list }) => (
  <Select
    className="filter-select"
    defaultValue="tekopora"
    value={value}
    onChange={onChange}
  >
    {list.map(renderOption)}
  </Select>
);

export default DataSourceSelector;

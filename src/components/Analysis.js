import React from 'react';
import '../css/analysis.css';

export default function Analysis() {
  return (
    <>
      <div className="content">
        <h1> An&aacute;lisis de datos </h1>
        <iframe
          title="scatter-plot-1"
          width="100%"
          height="630px"
          src={`${process.env.REACT_APP_DASH_URL}/`}
        ></iframe>
      </div>
    </>
  );
}

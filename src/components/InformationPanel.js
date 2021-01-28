import React from 'react';
import { Card } from 'antd';

export default function InformationPanel(props) {
  const contentRenderers = {
    dist_desc: n => (
      <p key="distrito">
        <b>Distrito: </b>
        {`${n}`}
      </p>
    ),
    tekopora: n => (
      <p key="tekopora">
        <b>Tekoporã: </b>
        {n > 1 ? `${n} familias beneficiarias` : `${n} familia beneficiaria`}
      </p>
    ),
    fundacion: n => (
      <p key="fundacion">
        <b>Fundación Paraguaya: </b>
        {n > 1
          ? `${n} familias en vulnerabilidad`
          : `${n} familia en vulnerabilidad`}
      </p>
    ),
    techo: n => (
      <p key="techo">
        <b>Techo: </b>
        {n > 1 ? `${n} asentamientos` : `${n} asentamiento`}
      </p>
    ),
    almuerzo: n => (
      <p key="almuerzo">
        <b>Almuerzo escolar: </b>
        {n > 1 ? `${n} escuelas priorizadas` : `${n} escuela priorizada`}
      </p>
    ),
    ande: n => (
      <p key="ande">
        <b>Tarifa social ANDE: </b>
        {n > 1 ? `${n} beneficiarios` : `${n} beneficiario`}
      </p>
    )
  };

  const content = Object.keys(props.locality.properties)
    .map(key =>
      contentRenderers[key]
        ? contentRenderers[key](props.locality.properties[key])
        : null
    )
    .filter(c => c);
  return (
    <div className="information-panel">
      {content && content.length > 0 && (
        <Card title={props.locality.properties.barlo_desc}>{content}</Card>
      )}
    </div>
  );
}

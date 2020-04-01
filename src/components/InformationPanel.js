import React from "react";
import { Card } from "antd";

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
        {`${n} beneficiarios`}
      </p>
    ),
    fundacion: n => (
      <p key="fundacion">
        <b>Fundación Paraguaya: </b>
        {`${n} familias en situación de pobreza`}
      </p>
    ),
    techo: n => (
      <p key="techo">
        <b>Techo: </b>
        {`${n} asentamientos`}
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
    <Card
      title={props.locality.properties.barlo_desc}
      className="information-panel"
    >
      {content}
    </Card>
  );
}

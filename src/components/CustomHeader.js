import React from "react";
import { Row, Col } from "antd";

export default class DncpHeader extends React.Component {
  render() {
    return (
      <Row>
        <Col span={3}>
          <img src="reaccion.png" alt="Reaccion" style={{ height: 50 }} />
        </Col>
        <Col span={8}>
          <h1>Priorizador de ayuda</h1>
        </Col>
      </Row>
    );
  }
}

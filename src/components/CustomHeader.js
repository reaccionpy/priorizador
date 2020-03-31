import React from "react";
import { Row, Col } from "antd";

export default class DncpHeader extends React.Component {
  render() {
    return (
      <Row>
        <Col span={4}>
          <img src="reaccion.png" alt="Reaccion" style={{ height: 50 }} />
        </Col>
      </Row>
    );
  }
}

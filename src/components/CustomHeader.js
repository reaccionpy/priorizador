import React from "react";
import { Row, Col, Select } from "antd";

const { Option } = Select;

export default class DncpHeader extends React.Component {
  render() {
    return (
      <Row>
        <Col span={3}>
          <img src="reaccion.png" alt="Reaccion" style={{ height: 50 }} />
        </Col>
        <Col span={6}>
          <h1>Priorizador de ayuda</h1>
        </Col>
        <Col span={2} offset={10}>
          <h3>Colorear por:</h3>
        </Col>
        <Col span={3}>
          <Select
            defaultValue="tekopora"
            onChange={this.props.onChange}
            style={{ width: 210 }}
          >
            <Option value="almuerzo">Almuerzo escolar</Option>
            <Option value="fundacion">Fundación Paraguaya</Option>
            <Option value="techo">Techo</Option>
            <Option value="tekopora">Tekoporā</Option>
          </Select>
        </Col>
      </Row>
    );
  }
}

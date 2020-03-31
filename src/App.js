import React from "react";
import "./App.css";
import { Row, Col, Layout } from "antd";
import CustomHeader from "./components/CustomHeader";
import CustomMap from "./components/CustomMap";
const { Header, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Header>
        <CustomHeader></CustomHeader>
      </Header>

      <Content>
        <Row>
          <CustomMap></CustomMap>
        </Row>
      </Content>
    </div>
  );
}

export default App;

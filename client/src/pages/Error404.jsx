import React from "react";
import { Col } from "react-bootstrap";
import ErrorImg from "../assets/error.png";
const Error404 = () => {
  return (
    <Col align="center">
      <img src={ErrorImg} alt="error" style={{ width: "20em" }} />
    </Col>
  );
};

export default Error404;

import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
const Home = ({ history }) => {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  return (
    <Row align="center" className="bg-white">
      <Col>
        <Link to="/login">
          <Button variant="link-dark">Login</Button>
        </Link>
      </Col>
      <Col>
        <Link to="/register">
          <Button variant="link-dark">Register</Button>
        </Link>
      </Col>
      <Col>
        <Button variant="link-dark" onClick={logout}>
          Logout
        </Button>
      </Col>
    </Row>
  );
};

export default Home;

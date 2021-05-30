import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Col, Form, Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Login(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted(data) {
      localStorage.setItem("token", data.login.token);
      props.history.push("/");
    },
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const submitLoginForm = (e) => {
    e.preventDefault();

    loginUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center rounded">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={variables.username}
              className={errors.username && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, username: e.target.value })
              }
            />
            {errors.username && (
              <p style={{ fontSize: ".7rem" }} className="text-danger">
                {errors.username}
              </p>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              className={errors.password && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
            {errors.password && (
              <p style={{ fontSize: ".7rem" }} className="text-danger">
                {errors.password}
              </p>
            )}
          </Form.Group>

          <div className="text-center mt-3">
            <Button variant="dark" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
            <br />
            <small>
              Don't have an account?{" "}
              <Link className="text-dark" to="/register">
                Register!
              </Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

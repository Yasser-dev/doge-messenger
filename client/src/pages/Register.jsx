import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Col, Form, Button, Card, Row } from "react-bootstrap";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

export default function Register(props) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, res) {
      console.log("RES", res);
    },
    onError(err) {
      console.log("ERR", err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();

    registerUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center rounded">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
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
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              className={errors.email && "is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
            {errors.email && (
              <p style={{ fontSize: ".7rem" }} className="text-danger">
                {errors.email}
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
          <Form.Group>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              className={errors.confirmPassword && "is-invalid"}
              onChange={(e) =>
                setVariables({
                  ...variables,
                  confirmPassword: e.target.value,
                })
              }
            />{" "}
            {errors.confirmPassword && (
              <p style={{ fontSize: ".7rem" }} className="text-danger">
                {errors.confirmPassword}
              </p>
            )}
          </Form.Group>
          <div className="text-center mt-3">
            <Button variant="dark" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

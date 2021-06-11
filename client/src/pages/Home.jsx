import React from "react";
import { Button, Col, Row, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
    }
  }
`;

export default function Home({ history }) {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user) => (
      <div key={user.username}>
        <p>{user.username}</p>
      </div>
    ));
  }
  return (
    <Card>
      <Row align="center">
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
    </Card>
  );
}

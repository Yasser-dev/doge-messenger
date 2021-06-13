import React, { useEffect, useState } from "react";
import { Col, Row, Image } from "react-bootstrap";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const Home = () => {
  const { loading, data, error } = useQuery(GET_USERS);
  const [selectedUser, setSelectedUser] = useState(null);

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  if (messagesData) console.log(messagesData.getMessages);

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
      <div
        className="d-flex p-3"
        onClick={() => setSelectedUser(user.username)}
        key={user.username}
      >
        <Image
          src={user.imageUrl}
          roundedCircle
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
        <div className="mx-2">
          <p>{user.username}</p>
          <p className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are now connected!"}
          </p>
        </div>
      </div>
    ));
  }
  return (
    <Row className=" bg-white rounded">
      <Col className="p-0 bg-secondary" xs={4}>
        {usersMarkup}
      </Col>
      <Col xs={8}>
        {messagesData && messagesData.getMessages.length > 0 ? (
          messagesData.getMessages.map((message) => (
            <p key={message.uuid}>{message.content}</p>
          ))
        ) : (
          <p>Messages</p>
        )}
      </Col>
    </Row>
  );
};
export default Home;

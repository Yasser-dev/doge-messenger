import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";

import "./App.scss";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { AuthProvider } from "./context/auth";
import DynamicRoute from "./util/DynamicRoute";
import Error404 from "./pages/Error404";
import Header from "./components/Header";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Container className="pt-5">
            <Switch>
              <DynamicRoute exact path="/" component={Home} authenticated />
              <DynamicRoute path="/register" component={Register} guest />
              <DynamicRoute path="/login" component={Login} guest />
              <Route component={Error404} />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

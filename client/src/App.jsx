import "./App.scss";
import { Col, Container, Row } from "react-bootstrap";
import Register from "./pages/Register";
function App() {
  return (
    <Container className="pt-5 d-flex align-items-center justify-content-center">
      <Register />
    </Container>
  );
}

export default App;

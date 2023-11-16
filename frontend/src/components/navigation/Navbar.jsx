import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="">Blockchain Energy Project</Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Home</Nav.Link>
            <Nav.Link href="/">Signin</Nav.Link>
            <Nav.Link href="/create-user">Signup</Nav.Link>
            <Nav.Link href="/set-new-password">Reset Password</Nav.Link>
            <Nav.Link href="/billing">Billing</Nav.Link>
            <Nav.Link href="/energy-usage">Energy Usage</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

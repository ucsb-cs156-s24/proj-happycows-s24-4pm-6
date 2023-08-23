import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import getBackgroundImage from "main/components/Utils/HomePageBackground";

const LoginCard = () => {
  return (
    <Card style={
      // Stryker disable next-line all : no need to unit test CSS
      { width: '18rem' }
    }>
      <Card.Body>
        <Card.Title data-testid="loginPage-cardTitle">Welcome to Happy Cows!</Card.Title>
        <Card.Text>
          In order to start playing, please login.
        </Card.Text>
        <Button href="/oauth2/authorization/google" variant="primary">Log In</Button>
      </Card.Body>
    </Card>
  )
}

export default function LoginPage() {

  const time = new Date().getHours();
  const Background = getBackgroundImage(time);
  
  return (
    <div  style={
      // Stryker disable next-line all : no need to unit test CSS
      { backgroundSize: 'cover', backgroundImage: `url(${Background})` }}>
      <BasicLayout>
        <Container style={
          // Stryker disable next-line all : no need to unit test CSS
          { marginTop: "8%" }}>
          <Row style={
            // Stryker disable next-line all : no need to unit test CSS
            { alignItems: "center", justifyContent: "center" }}>
            <Col sm="auto"><LoginCard /></Col>
          </Row>
        </Container>
      </BasicLayout>
    </div>
  )
}

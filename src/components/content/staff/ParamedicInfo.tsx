import {  Form, Row, Col, Container } from "react-bootstrap";
import FormControl from "../../fragments/forms/FormControl";
import { useState } from "react";


const ParamedicInfo = () => {
  const [birthdate] = useState("2000-05-20");
  const [phoneNumber] = useState("111222333");
  const [email] = useState("jan.nowak@test.pl");

  return (
    <Container>
    <h3 className="text-center mt-3">Dane ratownika</h3>
    <Form className="mt-3 w-50 me-1">
    <Row>
        <Col>
          <FormControl
            id="Date"
            className="mb-3 "
            value={birthdate}
            label="Data urodzenia"
            type="text"
            disabled={true}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormControl
            id="Date"
            className="mb-3 "
            value={phoneNumber}
            label="Numer telefonu"
            type="text"
            disabled={true}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormControl
            id="Date"
            className="mb-3 "
            value={email}
            label="Email"
            type="text"
            disabled={true}
          />
        </Col>
      </Row>
      
      </Form>
    </Container>
  );
};

export default ParamedicInfo;

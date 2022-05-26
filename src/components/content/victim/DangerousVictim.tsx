import { useNavigate } from "react-router-dom";
import Table from "../../fragments/Table";
import Button from '../../fragments/Button';
import Textarea from '../../fragments/FormTextArea';
import {  Form, Row, Col } from "react-bootstrap";
import FormControl from "../../fragments/FormControl";
import { useState } from "react";


const DangerousVictim = () => {
  const [firstName] = useState("Jan");
  const [lastName] = useState("Nowak");
  const [address] = useState("Warszawa, ul. Koszykowa");
  const [date] = useState("2022-05-20");
  const [reason, setReason] = useState("")
  const navigate = useNavigate();

  return (
    
    
    <Form className="mt-5 w-50 ">
      <h3 >Niebezpieczny Poszkodowany</h3>
      <Row>
        <Col>
          <FormControl
            id="firstName"
            className="mb-3 "
            value={firstName}
            label="Imię"
            type="text"
            disabled={true}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormControl
            id="lastName"
            className="mb-3 "
            value={lastName}
            label="Nazwisko"
            type="text"
            disabled={true}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormControl
            id="Address"
            className="mb-3 "
            value={address}
            label="Adres"
            type="text"
            disabled={true}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <FormControl
            id="Date"
            className="mb-5"
            value={date}
            label="Date"
            type="text"
            disabled={true}
          />
        </Col>
      </Row>
      <h4> Uzasadnienie zagrożenia: </h4>
        <Textarea  value={reason} onChange={(e) => setReason(e.target.value)}/>
        
        <Button className="mt-5 w-50 me-1" type="submit" text="Oznacz niebezpiecznego poszkodowanego" />
      <Button text="Wróć" className="mt-3 w-50" onClick={e => navigate("/")} />
    </Form>
  );
};

export default DangerousVictim;
import { useState } from "react";
import {  Navigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import Navtab from "../../fragments/navigation/Navtab";
import { Routes, Route } from "react-router-dom";
import ParamedicInfo from "./ParamedicInfo";
import ScheduleList from "../schedule/ScheduleList";
import AmbulanceView from "../ambulance/AmbulanceView";
import FormControl from "../../fragments/forms/FormControl";


const ParamedicView = () => {
    const [firstName] = useState("Jan");
    const [lastName] = useState("Nowak");
    //const navigate = useNavigate();

  

  const links = [
    { to: "data", text: "Dane ratownika" },
    { to: "/ambulances/1", text: "Karetka ratownika" },
    { to: "schedule", text: "Dyżur ratownika" }
  ];

  return (
    <Container fluid className="my-3">
    <h3 className="text-center mt-3">Ratownik</h3>
    <Form className="mt-3 w-50 me-1">
      <Row >
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
      </Form>
      <Navtab links={links} />
      <Routes>
        <Route path="" element={<Navigate replace to="data" />} />
        <Route path="data" element={<ParamedicInfo />} />
        <Route path="/ambulances/1" element={<AmbulanceView />} />
        <Route path="schedule" element={<ScheduleList />} />

      </Routes>
    </Container>
  );
};

export default ParamedicView;

import { useState } from "react";
import {  Form, Row, Col, Container } from "react-bootstrap";
import TextField from "../../fragments/forms/FormControl";
import FormSelect from "../../fragments/forms/FormSelect";
import Button from "../../fragments/util/Button";
import { useNavigate } from "react-router-dom";



const ScheduleAdd = () => {
    const [, setDateStart] = useState<Date | null>(null);
    const [, setDateEnd] = useState<Date | null>(null);
    const [paramedic, setParamedic] = useState(0);
    const [, setTimeStart] = useState('');
    const [, setTimeEnd] = useState('');
    const navigate = useNavigate();

    const paramedics = [
      "Jan Nowak",
      "Krzysztof Kowalski",

    ];

  return (
    <Container className="mb-2 ">
        <h1 className="mb-2 text-center">Ustal grafik</h1>
        <Form className="mt-3 me-1">
        <FormSelect className="justify-content-center mb-4 w-25" id="type" onChange={e => setParamedic(parseInt(e.target.value))} value={paramedic} label={'Ratownik'} options={paramedics} />
          <Row className="justify-content-center mb-3" >
            <Col>
            <TextField
              id="date"
              label="Data rozpoczęcia"
              type="date"
              value="2022-11-30"
              onChange={()=>setDateStart}
            />
            </Col>
          </Row>

          <Row className="justify-content-center mb-5" >
            <Col>
            <TextField
              id="time"
              label="Godzina rozpoczęcia"
              type="time"
              value="07:30"
              onChange={()=>setTimeStart}
            />
              </Col>
          </Row>



          <Row className="justify-content-center mb-3" >
            <Col>
            <TextField
              id="date"
              label="Data zakończenia"
              type="date"
              value="2022-11-30"
              onChange={()=>setDateEnd}
            />
            </Col>
          </Row>

          <Row className="justify-content-center mb-4">
            <Col>
              <TextField
                id="time"
                label="Godzina zakończenia"
                type="time"
                value="17:30"
                onChange={()=>setTimeEnd}
              />
            </Col>
          </Row>
      <Row className=" mb-2">
        <Button className="mt-3 w-25" type="submit" onClick={e => navigate("/schedule")}>Dodaj</Button>
        
      </Row>
      <Row className="">
        <Button className=" mt-3 w-25" onClick={e => navigate("/schedule")}>Wróć</Button>
      </Row>
</Form>
       

        
    </Container>
  );
};

export default ScheduleAdd;
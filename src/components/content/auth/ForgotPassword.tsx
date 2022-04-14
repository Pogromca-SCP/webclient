import { Container, Form, FormGroup, Row, Button } from "react-bootstrap";

export default function ForgotPassword() {
  return (
    <Container className="mt-5">
      <Form>
        <FormGroup className="mb-3">
          <Form.Label>Podaj swój adres e-mail, który ma zostać użyty w celu weryfikacji</Form.Label>
          <Form.Control type="email" />
        </FormGroup>
        <Row className="justify-content-center">
          <Button className="mt-3 w-25" variant="light-second">Wyślij kod</Button>
        </Row>
        <FormGroup className="mb-3">
          <Form.Label>Tu wpisz wysłany kod</Form.Label>
          <Form.Control type="password" />
        </FormGroup>
        <Row className="justify-content-center">
          <Button className="mt-3 w-25" type="submit" variant="light-second">Zweryfikuj</Button>
        </Row>
      </Form>
    </Container>
  );
}
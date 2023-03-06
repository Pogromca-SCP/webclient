import { useState } from "react";
import { Schedule, getEmptySchedule, formatSchedule } from "../../../api/sharedTypes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAbort } from "../../../hooks/useAbort";
import { registerEmployee } from "../../../api/adminCalls";
import { Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { EmployeeType } from "../../../api/enumCalls";
import NotBlank from "../../fragments/forms/api/NotBlank";
import Email from "../../fragments/forms/api/Email";
import Past from "../../fragments/forms/api/Past";
import FormPhoneNumber from "../../fragments/forms/FormPhoneNumber";
import Password from "../../fragments/forms/api/Password";
import ScheduleDisplay from "../../fragments/values/Schedule";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";

// A registration form with role and schedule assignment
const RegisterWithRole = () => {
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [events, setEvents] = useState<Schedule>(getEmptySchedule());
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const abort = useAbort();

  const handleSubmit = () => {
    if (password !== passwordCheck) {
      setError("Error.DifferentPasswords");
      return;
    }

    setError(undefined);

    registerEmployee(role, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      birthDate: birthDate,
      phoneNumber: phoneNumber,
      workSchedule: formatSchedule(events)
    }, abort).then(res => {
      if (res.ok) {
        navigate("/");
      } else {
        console.log(res);
        setError("Error.RegistrationFailed");
      }
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setError("Error.RegistrationFailed");
    });
  };

  return (
    <Container className="my-3 justify-content-center text-center">
      <h1>{t("Person.Adding")}</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center text-start">
          <EnumSelect id="role" required onChange={e => setRole(e.target.value)} onLoad={setRole} value={role} enum={EmployeeType} className="mb-3 w-50" label={t("Person.Role")} />
        </Row>
        <Row className="justify-content-center text-start">
          <NotBlank id="firstName" required onChange={e => setFirstName(e.target.value)} value={firstName} className="mb-3 w-50" label={t("Person.FirstName")} />
        </Row>
        <Row className="justify-content-center text-start">
          <NotBlank id="lastName" required onChange={e => setLastName(e.target.value)} value={lastName} className="mb-3 w-50" label={t("Person.LastName")} />
        </Row>
        <Row className="justify-content-center text-start">
          <Email id="email" required onChange={e => setEmail(e.target.value)} value={email} className="mb-3 w-50" label={t("Person.Email")} />
        </Row>
        <Row className="justify-content-center text-start">
          <Past id="birthDate" required onChange={e => setBirthDate(e.target.value)} value={birthDate} className="mb-3 w-50" label={t("Person.Birthdate")} />
        </Row>
        <Row className="justify-content-center text-start">
          <FormPhoneNumber id="phoneNumber" required onChange={e => setPhoneNumber(e.target.value)} value={phoneNumber} className="mb-3 w-50" label={t("Person.PhoneNumber")} />
        </Row>
        <Row className="justify-content-center text-start">
          <Password id="password" required onChange={e => setPassword(e.target.value)} value={password} className="mb-3 w-50" label={t("Person.Password")} />
        </Row>
        <Row className="justify-content-center text-start">
          <Password id="passwordCheck" required onChange={e => setPasswordCheck(e.target.value)} value={passwordCheck} className="mb-3 w-50" label={t("Password.Repeat")} />
        </Row>
        <h1>{t("Schedule.Schedule")}</h1>
        <ScheduleDisplay value={events} onChange={setEvents} />
        <Row className="justify-content-center">
          <Submit className="my-3 w-25" canSubmit={error !== undefined}>{t("Person.Add")}</Submit>
        </Row>
        <Row className="justify-content-center mx-3">
          <Error className="mb-3 w-50 text-start" error={error} />
        </Row>
      </Form>
    </Container>
  );
};

export default RegisterWithRole;

import { useState } from "react";
import { useLogin } from "../../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { registerUser, loginUser, JwtResponse } from "../../../api/authCalls";
import { missingDataError, networkError } from "../sharedStrings";
import { Container, Row, Alert } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import NotBlank from "../../fragments/forms/api/NotBlank";
import Email from "../../fragments/forms/api/Email";
import Past from "../../fragments/forms/api/Past";
import FormPhoneNumber from "../../fragments/forms/FormPhoneNumber";
import Password from "../../fragments/forms/api/Password";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";
import CAlert from "../../fragments/util/Alert";

// Registration form
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [innerError, setInnerError] = useState("");
  const login = useLogin();
  const { t } = useTranslation();
  const abort = useAbort();

  const handleSubmit = () => {
    setError(undefined);
    setInnerError("");

    if (password !== passwordCheck) {
      setError("Error.DifferentPasswords");
      return;
    }

    const mail = email;
    const pass = password;

    registerUser({
      firstName: firstName,
      lastName: lastName,
      email: mail,
      password: pass,
      birthDate: birthDate,
      phoneNumber: phoneNumber
    }, abort).then(res => {
      if (!res.ok) {
        setError("Error.RegistrationFailed");
        return;
      }

      loginUser({
        email: mail,
        password: pass
      }, abort).then(res => {
        if (res.ok) {
          return res.json();
        }
  
        setError("Error.PostRegisterFail");
        setInnerError("Error.IncorrectLogin");
        return undefined;
      }).then((data?: JwtResponse) => {
        if (data) {
          if (data.token && data.roles && data.email) {
            login(data.token, data.roles, data.email, data.userId);
          } else {
            setError("Error.PostRegisterFail");
            setInnerError(missingDataError);
          }
        }
      }).catch(err => {
        if (abort.signal.aborted) {
          return;
        }

        console.error(err);
        setError("Error.PostRegisterFail");
        setInnerError(networkError);
      });
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setError(networkError);
    });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">{t("Login.Register")}</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <NotBlank id="firstName" required onChange={e => setFirstName(e.target.value)} value={firstName} className="mb-3 w-50" label={t("Person.FirstName")} />
        </Row>
        <Row className="justify-content-center">
          <NotBlank id="lastName" required onChange={e => setLastName(e.target.value)} value={lastName} className="mb-3 w-50" label={t("Person.LastName")} />
        </Row>
        <Row className="justify-content-center">
          <Email id="email" required onChange={e => setEmail(e.target.value)} value={email} className="mb-3 w-50" label={t("Person.Email")} />
        </Row>
        <Row className="justify-content-center">
          <Past id="birthDate" required onChange={e => setBirthDate(e.target.value)} value={birthDate} className="mb-3 w-50" label={t("Person.Birthdate")} />
        </Row>
        <Row className="justify-content-center">
          <FormPhoneNumber id="phoneNumber" required onChange={e => setPhoneNumber(e.target.value)} value={phoneNumber} className="mb-3 w-50" label={t("Person.PhoneNumber")} />
        </Row>
        <Row className="justify-content-center">
          <Password id="password" required onChange={e => setPassword(e.target.value)} value={password} className="mb-3 w-50" label={t("Person.Password")} />
        </Row>
        <Row className="justify-content-center">
          <Password id="passwordCheck" required onChange={e => setPasswordCheck(e.target.value)} value={passwordCheck} className="mb-3 w-50" label={t("Password.Repeat")} />
        </Row>
        <Row className="justify-content-center mt-3">
          <Submit className="w-25" canSubmit={error !== undefined}>{t("Login.SignUp")}</Submit>
        </Row>
        <Row className="justify-content-center m-3">
          <Error className="w-50" error={error} innerLabel="Login.Error" innerError={innerError} />
        </Row>
        <Row className="justify-content-center m-3">
          <CAlert className="w-50">
            <Alert.Heading>{t("Login.CollectData")}</Alert.Heading>
            <p>{t("Login.NecessaryData")}</p>
          </CAlert>
        </Row>
      </Form>
    </Container>
  );
};

export default Register;

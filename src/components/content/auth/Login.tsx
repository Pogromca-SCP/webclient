import { useState } from "react";
import { useLogin } from "../../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { loginUser, JwtResponse } from "../../../api/authCalls";
import { missingDataError, networkError } from "../sharedStrings";
import { Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import Email from "../../fragments/forms/api/Email";
import Password from "../../fragments/forms/api/Password";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";
import Link from "../../fragments/navigation/Link";

// Login form
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const login = useLogin();
  const { t } = useTranslation();
  const abort = useAbort();

  const handleSubmit = () => {
    setError(undefined);
    
    loginUser({
      email: email,
      password: password,
    }, abort).then(res => {
      if (res.ok) {
        return res.json();
      }

      setError("Error.IncorrectLogin");
      return undefined;
    }).then((data?: JwtResponse) => {
      if (data) {
        if (data.token && data.roles && data.email) {
          login(data.token, data.roles, data.email, data.userId);
        } else {
          setError(missingDataError);
        }
      }
    }
    ).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setError(networkError);
    });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">{t("Login.Login")}</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Email id="email" required onChange={e => setEmail(e.target.value)} value={email} className="mb-3 w-50" label={t("Person.Email")}/>
        </Row>
        <Row className="justify-content-center">
          <Password id="password" required onChange={e => setPassword(e.target.value)} value={password} className="mb-3 w-50" label={t("Person.Password")} />
        </Row>
        <Row className="justify-content-center my-3">
          <Submit className="w-25" canSubmit={error !== undefined}>{t("Login.SignIn")}</Submit>
        </Row>
        <Row className="justify-content-center mx-3">
          <Error className="mt-3 w-50" error={error} />
        </Row>
        <Row className="text-center">
          <Link to="/forgotpassword">{t("Password.Forgot")}</Link>
        </Row>
      </Form>
    </Container>
  );
};

export default Login;

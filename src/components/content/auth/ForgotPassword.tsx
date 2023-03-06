import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { useNavigate } from "react-router-dom";
import { useNotify } from "../../../hooks/useNotify";
import { resetPassword, passwordToken } from "../../../api/authCalls";
import { unknownError, networkError } from "../sharedStrings";
import { Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import Password from "../../fragments/forms/api/Password";
import Email from "../../fragments/forms/api/Email";
import Submit from "../../fragments/forms/Submit";
import Button from "../../fragments/util/Button";
import Error from "../../fragments/forms/Error";

// Password recovery view
const ForgotPassword = () => {
  const [input, setInput] = useState("");
  const [token, setToken] = useState("");
  const [check, setCheck] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const abort = useAbort();
  const navigate = useNavigate();
  const notify = useNotify();

  const handleSubmit = () => {
    if (sent && input !== check) {
      setError("Error.DifferentPasswords");
      return;
    }

    setError(undefined);

    (sent ? resetPassword(token, {
      newPassword: input
    }, abort) : passwordToken({
      email: input
    }, abort)).then(res => {
      if (res.ok) {
        if (sent) {
          notify("Password.Reseting", "Password.Reseted");
          navigate("/login");
        } else {
          setError("");
          setInput("");
          setSent(true);
        }
      } else if (res.status === 404) {
        setError("Error.MailNotFound");
      } else if (res.status === 403) {
        setError("Error.ExpiredToken");
      } else {
        console.log(res);
        setError(sent ? "Error.IncorrectToken" : unknownError);
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.log(err);
        setError(networkError);
      }
    });
  };

  const goBack = () => {
    if (error === undefined) {
      return;
    }

    setInput("");
    setToken("");
    setCheck("");
    setSent(false);
    setError("");
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">{t("Password.Reseting")}</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          {sent ? <Password id="token" className="mb-3 w-50" label={t("Password.Token")} value={token} required onChange={e => setToken(e.target.value)} /> : <Email id="email" className="mb-3 w-50" label={t("Password.Email")} value={input} required onChange={e => setInput(e.target.value)} />}
        </Row>
        {sent ? (
          <>
            <Row className="justify-content-center">
              <Password id="password" className="mb-3 w-50" label={t("Password.New")} value={input} required onChange={e => setInput(e.target.value)} />
            </Row>
            <Row className="justify-content-center">
              <Password id="passwordCheck" className="mb-3 w-50" label={t("Password.Check")} value={check} required onChange={e => setCheck(e.target.value)} />
            </Row>
          </>
        ) : ""}
        <Row className="justify-content-center my-3">
          <Submit className="w-25" canSubmit={error !== undefined}>{t(sent ? "Password.Reset" : "Common.Send")}</Submit>
        </Row>
        {sent && error === undefined ? "" : (
          <Row className="justify-content-center my-3">
            <Button className="w-25" type="button" onClick={sent ? goBack : () => navigate("/login")}>{t(`Common.${sent ? "Back" : "Cancel"}`)}</Button>
          </Row>
        )}
        <Row className="justify-content-center mx-3">
          <Error className="mt-3 w-50" error={error} />
        </Row>
      </Form>
    </Container>
  );
};

export default ForgotPassword;

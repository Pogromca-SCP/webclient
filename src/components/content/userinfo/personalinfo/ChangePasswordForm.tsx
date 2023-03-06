import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../../hooks/useAbort";
import { useNavigate } from "react-router-dom";
import { useNotify } from "../../../../hooks/useNotify";
import { changePassword } from "../../../../api/authCalls";
import { networkError } from "../../sharedStrings";
import { Container } from "react-bootstrap";
import Form from "../../../fragments/forms/Form";
import Password from "../../../fragments/forms/api/Password";
import Submit from "../../../fragments/forms/Submit";
import NavButton from "../../../fragments/navigation/NavButton";
import Error from "../../../fragments/forms/Error";

// Change password form
const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const abort = useAbort();
  const navigate = useNavigate();
  const notify = useNotify();

  const onSubmit = () => {
    if (password !== passwordCheck) {
      setError("Error.DifferentPasswords");
      return;
    }

    setError(undefined);

    changePassword({
      oldPassword: oldPassword,
      newPassword: password
    }, abort).then(res => {
      if (res.ok) {
        notify("Password.Change", "Password.Changed");
        navigate("../userdata");
      } else {
        console.log(res);
        setError("Error.IncorrectPassword");
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setError(networkError);
      }
    });
  };

  return (
    <Container className="my-3">
      <h1 className="mb-3">{t("Password.Change")}</h1>
      <Form onSubmit={onSubmit}>
        <Password id="oldPassword" required onChange={e => setOldPassword(e.target.value)} className="mb-3" value={oldPassword} label={t("Password.Old")} />
        <Password id="password" required onChange={e => setPassword(e.target.value)} className="mb-3" value={password} label={t("Password.New")} />
        <Password id="passwordCheck" required onChange={e => setPasswordCheck(e.target.value)} className="mb-3" value={passwordCheck} label={t("Password.Check")} />
        <Submit canSubmit={error !== undefined}>{t("Password.Change")}</Submit>
        <NavButton to="../userdata" className="mx-3">{t("Common.Cancel")}</NavButton>
        <Error className="mt-3" error={error} />
      </Form>
    </Container>
  );
};

export default ChangePasswordForm;

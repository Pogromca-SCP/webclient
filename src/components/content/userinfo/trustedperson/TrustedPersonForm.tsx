import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../../hooks/useAbort";
import { getEmail } from "../../../../helpers/authHelper";
import { userEmailError, missingDataError, unknownError, networkError } from "../../sharedStrings";
import { getTrustedPersonByEmail, TrustedPersonResponse, createTrustedPerson, updateTrustedPerson } from "../../../../api/trustedPersonCalls";
import { Container, Row } from "react-bootstrap";
import Form from "../../../fragments/forms/Form";
import NotBlank from "../../../fragments/forms/api/NotBlank";
import Email from "../../../fragments/forms/api/Email";
import FormPhoneNumber from "../../../fragments/forms/FormPhoneNumber";
import Submit from "../../../fragments/forms/Submit";
import Button from "../../../fragments/util/Button";
import Error from "../../../fragments/forms/Error";

// Form for thrusted person adding/editing
const TrustedPersonForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [readOnly, setReadOnly] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const { t } = useTranslation();
  const abort = useAbort();

  // Updates form data after changes
  useEffect(() => {
    if (!readOnly) {
      return;
    }

    const email = getEmail();

    if (!email) {
      console.error(userEmailError);
      return;
    }
    
    setError(undefined);
    const abortUpdate = new AbortController();

    getTrustedPersonByEmail(email, abortUpdate).then(res => res.json()).then((data: TrustedPersonResponse) => {
      if (data.firstName && data.lastName && data.phone) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email ?? "");
        setPhoneNumber(data.phone);
        setIsNew(false);
        setError("");
      } else {
        setError(missingDataError);
      }
    }).catch(err => {
      if (abortUpdate.signal.aborted) {
        return;
      }

      console.error(err);
      setError("");
    });

    return () => abortUpdate.abort();
  }, [readOnly]);

  const onSubmit = () => {
    if (readOnly) {
      setReadOnly(false);
      setError("");
      return;
    }

    setError(undefined);
    const userEmail = getEmail();

    if (!userEmail) {
      console.error(userEmailError);
      setError("");
      return;
    }

    const person = {
      userEmail: userEmail,
      firstName: firstName,
      lastName: lastName,
      email: email ? email : null,
      phone: phoneNumber
    };

    (isNew ? createTrustedPerson(person, abort) : updateTrustedPerson(person, abort)).then(res => {
      if (res.ok) {
        setReadOnly(true);
        setError("");
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.error(err);
      setError(networkError);
    });
  };

  return (
    <Container className="my-3">
      <h1 className="mb-3">{t("Person.TrustedPerson")}</h1>
      <Form onSubmit={onSubmit}>
        <Row md={2}>
          <NotBlank id="firstName" required onChange={e => setFirstName(e.target.value)} className="mb-3" value={firstName} label={t("Person.FirstName")} disabled={readOnly} />
          <NotBlank id="lastName" required onChange={e => setLastName(e.target.value)} className="mb-3" value={lastName} label={t("Person.LastName")} disabled={readOnly} />
        </Row>
        <Row md={2}>
          <Email id="email" onChange={e => setEmail(e.target.value)} className="mb-3" value={email} label={t("Person.Email")} disabled={readOnly} />
          <FormPhoneNumber id="phoneNumber" required onChange={e => setPhoneNumber(e.target.value)} className="mb-3" value={phoneNumber} label={t("Person.PhoneNumber")} disabled={readOnly} />
        </Row>
        <Submit canSubmit={error !== undefined}>{readOnly ? t("Common.Edit") : t("Common.Save")}</Submit>
        {readOnly ? "" : <Button type="button" onClick={e => setReadOnly(true)} className="mx-3">{t("Common.Cancel")}</Button>}
        <Error className="mt-3" error={error} />
      </Form>
    </Container>
  );
};

export default TrustedPersonForm;

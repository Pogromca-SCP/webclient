import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAbort } from "../../../hooks/useAbort";
import { useTranslation } from "react-i18next";
import { getVictimById, VictimResponse, addVictim, updateVictim } from "../../../api/incidentCalls";
import { missingDataError, loadingError, unknownError, networkError } from "../sharedStrings";
import { Container, Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import NotBlank from "../../fragments/forms/api/NotBlank";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { Gender, VictimStatus } from "../../../api/enumCalls";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";

// Victim add/edit form component
const VictimForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { reportId, victimId } = useParams();
  const navigate = useNavigate();
  const abort = useAbort();
  const { t } = useTranslation();

  useEffect(() => {
    if (reportId === undefined || victimId === undefined) {
      return;
    }

    setError(undefined);
    const abortUpdate = new AbortController();

    getVictimById(parseInt(reportId), parseInt(victimId), abortUpdate).then(res => res.json()).then((data: VictimResponse) => {
      if (data.firstName && data.lastName && data.gender && data.status) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setGender(data.gender);
        setStatus(data.status);
        setError("");
      } else {
        console.log(data);
        setError(missingDataError);
      }
    }).catch(err => {
      if (abortUpdate.signal.aborted) {
        return;
      }

      console.error(err);
      setError(loadingError);
    });

    return () => abortUpdate.abort();
  }, [reportId, victimId]);

  const onSubmit = () => {
    if (reportId === undefined) {
      return;
    }

    setError(undefined);
    const id = parseInt(reportId);
    
    const victim = {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      status: status
    };

    (victimId === undefined ? addVictim(id, victim, abort) : updateVictim(id, parseInt(victimId), victim, abort)).then(res => {
      if (res.ok) {
        navigate("../vict");
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.log(err);
      setError(networkError);
    });
  };

  return (
    <Container className="my-3 justify-content-center w-50">
      <Form onSubmit={onSubmit}>
        <h1 className="text-center my-3">{t(`Victim.${victimId === undefined ? "Adding" : "Editing"}`)}</h1>
        <Row className="justify-content-center mb-3">
          <NotBlank id="firstName" label={t("Person.FirstName")} required value={firstName} onChange={e => setFirstName(e.target.value)} />
        </Row>
        <Row className="justify-content-center mb-3">
          <NotBlank id="lastName" label={t("Person.LastName")} required value={lastName} onChange={e => setLastName(e.target.value)} />
        </Row>
        <Row className="justify-content-center mb-3">
          <EnumSelect id="gender" label={t("Person.Gender")} required enum={Gender} value={gender} onChange={e => setGender(e.target.value)} onLoad={setGender} />
        </Row>
        <Row className="justify-content-center mb-3">
          <EnumSelect id="status" label={t("Victim.Status")} required enum={VictimStatus} value={status} onChange={e => setStatus(e.target.value)} onLoad={setStatus} />
        </Row>
        <Row className="justify-content-center mb-5 mt-3">
          <Submit className="w-50" canSubmit={error !== undefined}>{victimId === undefined ? t("Victim.Create") : t("Common.SaveChanges")}</Submit>
        </Row>
        <Error className="mt-3" error={error} />
      </Form>
    </Container>
  );
};

export default VictimForm;

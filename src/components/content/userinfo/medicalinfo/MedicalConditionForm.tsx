import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../../hooks/useAbort";
import { getDiseaseById, DiseaseResponse, createDisease, updateDisease } from "../../../../api/diseaseCalls";
import { missingDataError, loadingError, userEmailError, unknownError, networkError } from "../../sharedStrings";
import { getEmail } from "../../../../helpers/authHelper";
import { Container, Row, Col } from "react-bootstrap";
import Form from "../../../fragments/forms/Form";
import NotBlank from "../../../fragments/forms/api/NotBlank";
import FormCheck from "../../../fragments/forms/FormCheck";
import Submit from "../../../fragments/forms/Submit";
import NavButton from "../../../fragments/navigation/NavButton";
import Error from "../../../fragments/forms/Error";

// Form for adding/editing conditions
const MedicalConditionForm = () => {
  const [diseaseName, setDiseaseName] = useState("");
  const [description, setDescription] = useState("");
  const [share, setShare] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const { diseaseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const abort = useAbort();

  // Loads condition data to edit
  useEffect(() => {
    if (diseaseId !== undefined) {
      setError(undefined);
      const abortUpdate = new AbortController();

      getDiseaseById(parseInt(diseaseId), abortUpdate).then(res => res.json()).then((data: DiseaseResponse) => {
        if (data.description && data.diseaseName) {
          setDiseaseName(data.diseaseName);
          setDescription(data.description);
          setShare(data.shareWithBand === true);
          setError("");
        } else {
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
    }
  }, [diseaseId]);

  const onSubmit = () => {
    setError(undefined);
    const email = getEmail();

    if (!email) {
      console.error(userEmailError);
      setError("");
      return;
    }

    const disease = {
      userEmail: email,
      diseaseName: diseaseName,
      description: description,
      shareWithBand: share
    };

    (diseaseId === undefined ? createDisease(disease, abort) : updateDisease(parseInt(diseaseId), disease, abort)).then(res => {
      if (res.ok) {
        navigate("../medicaldata");
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
      <h1 className="mb-3">{diseaseId === undefined ? t("Disease.Adding") : t("Disease.Editing")}</h1>
      <Form onSubmit={onSubmit}>
        <NotBlank id="diseaseName" className="mb-3" label={t("Disease.Name")} required value={diseaseName} onChange={e => setDiseaseName(e.target.value)} />
        <NotBlank id="description" className="mb-3" label={t("Disease.Description")} required value={description} onChange={e => setDescription(e.target.value)} />
        <FormCheck id="shareWithBand" className="mb-3" label={t("Disease.ShareWithBand")} value={share} onChange={e => setShare(!share)} />
        <Row>
          <Col md="auto">
            <Submit canSubmit={error !== undefined}>{diseaseId === undefined ? t("Common.Add") : t("Common.Save")}</Submit>
          </Col>
          <Col md="auto">
            <NavButton to="../medicaldata">{t("Common.Cancel")}</NavButton>
          </Col>
          <Col />
        </Row>
        <Error className="mt-3" error={error} />
      </Form>
    </Container>
  );
};

export default MedicalConditionForm;

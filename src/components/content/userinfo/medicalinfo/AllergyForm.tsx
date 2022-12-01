import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllergyById, AllergyResponse, createAllergy, updateAllergy } from "../../../../api/allergyCalls";
import { missingDataError, loadingError, userEmailError, unknownError, networkError, errorHeader } from "../../sharedStrings";
import { getEmail } from "../../../../helpers/authHelper";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Form from "../../../fragments/forms/Form";
import EnumSelect from "../../../fragments/forms/api/EnumSelect";
import { AllergyType } from "../../../../api/enumCalls";
import NotBlank from "../../../fragments/forms/api/NotBlank";
import Submit from "../../../fragments/forms/Submit";
import NavButton from "../../../fragments/navigation/NavButton";

const AllergyForm = () => {
  const [allergyType, setAllergyType] = useState("");
  const [allergyName, setAllergyName] = useState("");
  const [other, setOther] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { allergyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (allergyId !== undefined) {
      setError(undefined);

      getAllergyById(parseInt(allergyId)).then(res => res.json()).then((data: AllergyResponse) => {
        if (data.allergyType && data.allergyName && data.other) {
          setAllergyType(data.allergyType);
          setAllergyName(data.allergyName);
          setOther(data.other);
          setError("");
        } else {
          setError(missingDataError);
        }
      }).catch(err => {
        console.error(err);
        setError(loadingError);
      });
    }
  }, [allergyId]);

  const onSubmit = () => {
    setError(undefined);
    const email = getEmail();

    if (!email) {
      console.error(userEmailError);
      setError("");
      return;
    }

    const allergy = {
      userEmail: email,
      allergyType: allergyType,
      allergyName: allergyName,
      other: other
    };

    (allergyId === undefined ? createAllergy(allergy) : updateAllergy(parseInt(allergyId), allergy)).then(res => {
      if (res.ok) {
        navigate("../medicaldata");
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      console.error(err);
      setError(networkError);
    });
  };

  return (
    <Container className="my-3">
      <h1 className="mb-3">{allergyId === undefined ? t("Allergy.Adding") : t("Allergy.Editing")}</h1>
      <Form onSubmit={onSubmit}>
        <EnumSelect id="allergyType" className="mb-3" label={t("Allergy.Type")} required enum={AllergyType} value={allergyType} onLoad={setAllergyType} onChange={e => setAllergyType(e.target.value)} />
        <NotBlank id="allergyName" className="mb-3" label={t("Allergy.Name")} required value={allergyName} onChange={e => setAllergyName(e.target.value)} />
        <NotBlank id="other" className="mb-3" label={t("Allergy.Other")} required value={other} onChange={e => setOther(e.target.value)} />
        <Row>
          <Col md="auto">
            <Submit canSubmit={error !== undefined}>{allergyId === undefined ? t("Common.Add") : t("Common.Save")}</Submit>
          </Col>
          <Col md="auto">
            <NavButton to="../medicaldata">{t("Common.Cancel")}</NavButton>
          </Col>
          <Col />
        </Row>
        {error ? (
          <Alert variant="danger" className="mt-3">
            <Alert.Heading>{t(errorHeader)}</Alert.Heading>
            <p>{t(error)}</p>
          </Alert>
        ) : ""}
      </Form>
    </Container>
  );
};

export default AllergyForm;

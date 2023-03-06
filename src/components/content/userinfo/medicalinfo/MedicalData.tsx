import { useState, useEffect } from "react";
import { AllergyResponse } from "../../../../api/allergyCalls";
import { DiseaseResponse } from "../../../../api/diseaseCalls";
import { useTranslation } from "react-i18next";
import { getEmail } from "../../../../helpers/authHelper";
import { userEmailError } from "../../sharedStrings";
import { getMedicalInfoByEmail, MedicalInfoResponse } from "../../../../api/medicalInfoCalls";
import { Container } from "react-bootstrap";
import BloodTypeForm, { Blood } from "./BloodTypeForm";
import AllergyTable from "./AllergyTable";
import MedicalConditionTable from "./MedicalConditionTable";

// Displays complete set of user's medical data
const MedicalData = () => {
  const [blood, setBlood] = useState<Blood>({});
  const [allergies, setAllergies] = useState<AllergyResponse[]>([]);
  const [conditions, setConditions] = useState<DiseaseResponse[]>([]);
  const [isloading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Loads user's medical data
  useEffect(() => {
    const email = getEmail();

    if (!email) {
      console.error(userEmailError);
      return;
    }

    const abort = new AbortController();

    getMedicalInfoByEmail(email, abort).then(res => res.json()).then((data: MedicalInfoResponse) => {
      if (data.medicalInfoId) {
        setBlood({
          id: data.medicalInfoId,
          bloodType: data.bloodType,
          rhType: data.rhType
        });
      }

      if (data.allergies) {
        setAllergies(data.allergies);
      }

      if (data.diseases) {
        setConditions(data.diseases);
      }

      setIsLoading(false);
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.error(err);
      setIsLoading(false);
    });

    return () => abort.abort();
  }, []);

  const removeAllergy = (x: Readonly<AllergyResponse>) => setAllergies(allergies.filter(a => a.allergyId !== x.allergyId));
  const removeDisease = (x: Readonly<DiseaseResponse>) => setConditions(conditions.filter(c => c.diseaseId !== x.diseaseId));

  return (
    <Container className="my-3">
      <h1 className="mb-3">{t("Person.MedicalData")}</h1>
      <BloodTypeForm id={blood.id} bloodType={blood.bloodType} rhType={blood.rhType} />
      <AllergyTable data={allergies} isLoading={isloading} onRemove={removeAllergy} />
      <MedicalConditionTable data={conditions} isLoading={isloading} onRemove={removeDisease} />
    </Container>
  );
};

export default MedicalData;

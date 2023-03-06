import { useTranslation } from "react-i18next";
import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, medicalInfo, scheduleOwner } from "../../../helpers/authHelper";
import { Container } from "react-bootstrap";
import Navtab from "../../fragments/navigation/Navtab";
import { Routes, Route } from "react-router-dom";
import UserDataForm from "./personalinfo/UserDataForm";
import ChangePasswordForm from "./personalinfo/ChangePasswordForm";
import TrustedPersonForm from "./trustedperson/TrustedPersonForm";
import ConditionalRoute from "../../fragments/navigation/ConditionalRoute";
import MedicalData from "./medicalinfo/MedicalData";
import AllergyForm from "./medicalinfo/AllergyForm";
import MedicalConditionForm from "./medicalinfo/MedicalConditionForm";
import UserSchedule from "../schedule/UserSchedule";

// User settings router
const Settings = () => {
  const { t } = useTranslation();
  const roles = useRoles();
  const medical = hasPerm(roles, medicalInfo);
  const schedule = hasPerm(roles, scheduleOwner);

  const links = [
    { to: "userdata", text: t("Person.UserData") }
  ];

  if (medical) {
    links.push({ to: "medicaldata", text: t("Person.MedicalData") });
    links.push({ to: "trustedperson", text: t("Person.TrustedPerson") });
  }

  if (schedule) {
    links.push({ to: "schedule", text: t("Schedule.Schedule") });
  }

  return (
    <Container className="my-3">
      <h1><b>{t("Person.MyData")}</b></h1>
      <Navtab links={links}/>
      <Routes>
        <Route path="userdata" element={<UserDataForm />} />
        <Route path="userdata/password" element={<ChangePasswordForm />} />
        <Route path="medicaldata" element={<ConditionalRoute condition={medical} element={<MedicalData />} />} />
        <Route path="medicaldata/allergy" element={<ConditionalRoute condition={medical} element={<AllergyForm />} />} />
        <Route path="medicaldata/allergy/:allergyId" element={<ConditionalRoute condition={medical} element={<AllergyForm />} />} />
        <Route path="medicaldata/disease" element={<ConditionalRoute condition={medical} element={<MedicalConditionForm />} />} />
        <Route path="medicaldata/disease/:diseaseId" element={<ConditionalRoute condition={medical} element={<MedicalConditionForm />} />} />
        <Route path="trustedperson" element={<ConditionalRoute condition={medical} element={<TrustedPersonForm />} />} />
        <Route path="schedule" element={<ConditionalRoute condition={schedule} element={<UserSchedule />} />} />
      </Routes>
    </Container>
  );
};

export default Settings;

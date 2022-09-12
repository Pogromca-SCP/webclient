import { Container } from "react-bootstrap";
import BloodTypeForm from "./BloodTypeForm";
import AllergyTable from "../allergy/AllergyTable";
import MedicalConditionTable from "../medicalcondition/MedicalConditionTable";

const EditBloodTypeView = () => {
  return (
    <Container className="my-3">
      <h1 className="mb-3">Dane medyczne</h1>
      <BloodTypeForm data={{}} />
      <AllergyTable data={[]} />
      <MedicalConditionTable data={[]} />
    </Container>
  );
};

export default EditBloodTypeView;

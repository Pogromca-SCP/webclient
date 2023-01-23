import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getMedics, getDispatchers, getAmbulanceManagers, MedicResponse, DispatcherResponse, AmbulanceManagerResponse } from "../../../api/employeeCalls";
import { Container } from "react-bootstrap";
import Table from "../../fragments/util/Table";

interface UniformEmployeeData {
  firstName: string,
  lastName: string,
  email: string
}

// Displays all employees
const StaffList = () => {
  const [workers, setWorkers] = useState<UniformEmployeeData[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Loads staff members to display
  useEffect(() => {
    const abortUpdate = new AbortController();
    const medReq = getMedics(abortUpdate).then(res => res.json());
    const disReq = getDispatchers(abortUpdate).then(res => res.json());
    const ambReq = getAmbulanceManagers(abortUpdate).then(res => res.json());

    Promise.all([medReq, disReq, ambReq]).then((data: [MedicResponse[], DispatcherResponse[], AmbulanceManagerResponse[]]) => {
      if (data) {
        setWorkers([...data[0].map(m => ({
          firstName: m.firstName,
          lastName: m.lastName,
          email: m.email
        })), ...data[1].map(d => ({
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email
        })), ...data[2].map(a => ({
          firstName: a.name,
          lastName: a.lastName,
          email: a.email
        }))]);
      }

      setIsLoading(false);
    }).catch(err => {
      if (!abortUpdate.signal.aborted) {
        console.error(err);
        setIsLoading(false);
      }
    });

    return () => abortUpdate.abort();
  }, []);

  const mailField = "email";
  const nameField = "firstName";
  const lastField = "lastName";

  const cols = [
    { name: t("Person.Email"), property: mailField, sortBy: mailField, filterBy: mailField },
    { name: t("Person.FirstName"), property: nameField, sortBy: nameField, filterBy: nameField },
    { name: t("Person.LastName"), property: lastField, sortBy: lastField, filterBy: lastField },
  ];

  return (
    <Container className="mt-3 justify-content-center text-center">
      <h3>{t("Ambulance.Ambulances")}</h3>
      <Table columns={cols} data={workers} isLoading={isLoading} />
    </Container>
  );
};

export default StaffList;

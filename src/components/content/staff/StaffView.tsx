import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import Navtab from "../../fragments/navigation/Navtab";
import { Routes, Route } from "react-router-dom";
import StaffList from "./StaffList";
import ScheduleList from "../schedule/ScheduleList";

// Staff views router
const StaffView = () => {
  const { t } = useTranslation();

  const links = [
    { to: "workers", text: t("Staff.Workers") },
    { to: "schedules", text: t("Staff.Schedules") }
  ];

  return (
    <Container fluid className="my-3">
      <Navtab links={links} />
      <Routes>
        <Route path="" element={<Navigate replace to="workers" />} />
        <Route path="workers" element={<StaffList />} />
        <Route path="schedules" element={<ScheduleList />} />
      </Routes>
    </Container>
  );
};

export default StaffView;

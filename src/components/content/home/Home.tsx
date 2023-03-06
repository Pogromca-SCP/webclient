import { useRoles } from "../../../hooks/useAuth";
import { hasPerm, ambulanceManagement, incidentInfo } from "../../../helpers/authHelper";
import DispositorHome from "./DispositorHome";
import AdminHome from "./AdminHome";
import GuestHome from "./GuestHome";

// Home page component
const Home = () => {
  const roles = useRoles();
  const ambulance = hasPerm(roles, ambulanceManagement);
  const incident = hasPerm(roles, incidentInfo);

  if (ambulance) {
    return <AdminHome />;
  } else if (incident) {
    return <DispositorHome />;
  } else {
    return <GuestHome />;
  }
};

export default Home;

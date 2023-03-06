import { useNotificationsManager } from "../../../hooks/useNotify";
import { ToastContainer } from "react-bootstrap";
import Notification from "./Notification";

// Container area for app notifications
const NotificationArea = () => {
  const notifManager = useNotificationsManager();

  return (
    <div aria-live="polite" aria-atomic="true">
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
        {notifManager.notifications.map((notification, index) => (
          <Notification notif={notification} key={index} />
        ))}
      </ToastContainer>
    </div>
  );
};

export default NotificationArea;

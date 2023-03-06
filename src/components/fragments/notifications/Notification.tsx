import { Notification as Notif, useNotificationsManager } from "../../../hooks/useNotify";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useTranslation } from "react-i18next";
import { Toast } from "react-bootstrap";
import { customTheme, customVar } from "../sharedParams";

export interface NotificationParams {
  notif: Notif
}

// Notification component with dark mode support
const Notification = (props: Readonly<NotificationParams>) => {
  const notifManager = useNotificationsManager();
  const darkMode = useDarkMode();
  const { t } = useTranslation();

  return (
    <Toast show onClose={e => notifManager.removeNotification(props.notif)} bg={customTheme(darkMode)}>
      <Toast.Header className={`toast-header-${customVar(darkMode)}`} closeVariant={darkMode ? "white" : undefined}>
        <strong className="me-auto">{t(props.notif.title)}</strong>
      </Toast.Header>
      <Toast.Body>{t(props.notif.content)}</Toast.Body>
    </Toast>
  );
};

export default Notification;

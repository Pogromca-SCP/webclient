import { useState, useEffect } from "react";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { isDuringShift, endShift, startShift } from "../../../api/employeeCalls";
import { Nav, Spinner } from "react-bootstrap";
import { CgWorkAlt } from "react-icons/cg";

// Shift toggle button for users
const CheckIn = () => {
  const [checked, setChecked] = useState(false);
  const [processing, setProcessing] = useState(true);
  const darkMode = useDarkMode();
  const { t } = useTranslation();
  const abort = useAbort();

  useEffect(() => {
    const abortUpdate = new AbortController();

    isDuringShift(abortUpdate).then(res => res.json()).then((data: boolean) => {
      if (typeof(data) === "boolean") {
        setChecked(data);
      } else {
        console.log(data);
      }

      setProcessing(false);
    }).catch(err => {
      if (!abortUpdate.signal.aborted) {
        console.error(err);
        setProcessing(false);
      }
    });

    return () => abortUpdate.abort();
  }, []);

  const onToggle = () => {
    if (processing) {
      return;
    }

    setProcessing(true);

    (checked ? endShift(abort) : startShift(abort)).then(res => {
      if (res.ok) {
        setChecked(!checked);
      } else {
        console.log(res);
      }

      setProcessing(false);
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setProcessing(false);
      }
    });
  };

  return (
    <Nav.Link onClick={onToggle} className={`d-inline-flex align-items-center ${checked ? "bg-danger" : `nav-link-${darkMode ? "dark" : "light"}`}`}>
      <CgWorkAlt />
      <span className="px-1">{processing ? <Spinner animation="border" /> : (checked ? t("Person.FinishDuty") : t("Person.StartDuty"))}</span>
    </Nav.Link>
  );
};

export default CheckIn;

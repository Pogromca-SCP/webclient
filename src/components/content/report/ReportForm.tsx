import { MapViewHelperParams } from "../sharedViewsParams";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePopup } from "../../../hooks/usePopup";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { createAccident, updateAccident, getAccidentById, AccidentReportResponse } from "../../../api/accidentReportCalls";
import { unknownError, networkError, geolocationError, missingDataError, loadingError } from "../sharedStrings";
import { getEmail } from "../../../helpers/authHelper";
import { userEmailError } from "../sharedStrings";
import ConfirmPopup from "../../fragments/popups/ConfirmPopup";
import Form from "../../fragments/forms/Form";
import { Row } from "react-bootstrap";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { EmergencyType } from "../../../api/enumCalls";
import FormCheck from "../../fragments/forms/FormCheck";
import Number from "../../fragments/forms/api/Number";
import NotBlank from "../../fragments/forms/api/NotBlank";
import FormTextArea from "../../fragments/forms/FormTextArea";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";
import { accidentIcon } from "../map/MapIcons";
import MapView from "../../fragments/map/MapView";

interface ReportViewParams extends MapViewHelperParams {
  type: string,
  setType: (x: string) => void,
  breathing: boolean,
  setBreathing: (x: boolean) => void,
  conscious: boolean,
  setConscious: (x: boolean) => void,
  amountVictims: number,
  setAmountVictims: (x: number) => void,
  bandCode: string,
  setBandCode: (x: string) => void,
  desc: string,
  setDesc: (x: string) => void
}

// Report form component
const ReportView = (props: Readonly<ReportViewParams>) => {
  const [error, setError] = useState(props.error);
  const navigate = useNavigate();
  const { reportId } = useParams();
  const popup = usePopup();
  const { t } = useTranslation();
  const abort = useAbort();

  // Updates error message
  useEffect(() => setError(props.error), [props.error]);

  const handleSubmit = () => {
    setError(undefined);
    const email = getEmail();

    if (!email) {
      console.error(userEmailError);
      setError("");
      return;
    }

    const report = {
      bandCode: props.bandCode,
      emergencyType: props.type,
      victimCount: props.amountVictims,
      breathing: props.breathing,
      longitude: props.lng,
      latitude: props.lat,
      description: props.desc
    };

    (reportId === undefined ? createAccident({
      ...report,
      concious: props.conscious,
      email: email
    }, abort) : updateAccident(parseInt(reportId), {
      ...report,
      consciousness: props.conscious
    }, abort)).then(res => {
      if (res.ok) {
        navigate("/home");
      } else if (res.status === 406) {
        setError("Error.NoDispatcherFound");
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }

      console.error(err);
      setError(networkError);
    })
  };

  const onSubmit = () => popup(<ConfirmPopup text={`Report.Confirm${reportId === undefined ? "Create" : "Edit"}`} onConfirm={handleSubmit} />);

  return (
    <Form onSubmit={onSubmit} className="w-50">
      <h1 className="text-center mt-3">{t("Report.Report")}</h1>
      <Row className="justify-content-center mb-3">
        <EnumSelect id="emergencyType" enum={EmergencyType} onChange={e => props.setType(e.target.value)} required value={props.type} onLoad={props.setType} label={t("Report.Type")} />
      </Row>
      <Row className="justify-content-center mb-3 ml-2">
        <FormCheck id="breathing" onChange={e => props.setBreathing(!props.breathing)} value={props.breathing} label={t("Report.Breathing")} />
      </Row>
      <Row className="justify-content-center mb-3 ml-2">
        <FormCheck id="conscious" onChange={e => props.setConscious(!props.conscious)} value={props.conscious} label={t("Report.Consious")} />
      </Row>
      <Row className="justify-content-center mb-3">
        <Number id="amountVictims" minValue={1} onChange={e => props.setAmountVictims(parseInt(e.target.value))} required value={props.amountVictims} label={t("Report.VictimsCount")} />
      </Row>
      <Row className="justify-content-center mb-3">
        <NotBlank id="bandCode" onChange={e => props.setBandCode(e.target.value)} value={props.bandCode} label={t("Report.BandCode")} />
      </Row>
      <Row className="justify-content-center mb-3">
        <FormTextArea id="description" onChange={e => props.setDesc(e.target.value)} value={props.desc} label={t("Report.Description")} maxLength={100} />
      </Row>
      <h4 className="text-center mt-3">{t("Map.Location")}</h4>
      <Row className="justify-content-center mb-3">
        <Number id="lat" value={props.lat} disabled />
      </Row>
      <Row className="justify-content-center mb-3">
        <Number id="lng" value={props.lng} disabled />
      </Row>
      <Row className="justify-content-center mb-5 mt-3">
        <Submit className="w-50" canSubmit={error !== undefined}>{reportId === undefined ? t("Report.Create") : t("Common.SaveChanges")}</Submit>
      </Row>
      <Error className="mt-3" error={error} />
    </Form>
  );
};

// Map wrapper for report form
const ReportForm = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [type, setType] = useState("");
  const [breathing, setBreathing] = useState(true);
  const [conscious, setConscious] = useState(true);
  const [amountVictims, setAmountVictims] = useState(1);
  const [bandCode, setBandCode] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const { reportId } = useParams();

  // Loads report data for editing
  useEffect(() => {
    setError(undefined);

    if (reportId === undefined) {
      // Centers map view on current location
      navigator.geolocation.getCurrentPosition(pos => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setError("");
      }, err => setError(geolocationError));

      return;
    }

    const abortUpdate = new AbortController();

    getAccidentById(parseInt(reportId), abortUpdate).then(res => res.json()).then((data: AccidentReportResponse) => {
      if (data.emergencyType && data.location && data.victimCount !== undefined) {
        setType(data.emergencyType);
        setBreathing(data.breathing);
        setConscious(data.consciousness);
        setAmountVictims(data.victimCount);
        setBandCode(data.bandCode ?? "");
        setDesc(data.description);
        setCoords([data.location.latitude, data.location.longitude]);
        setError("");
      } else {
        console.log(data);
        setError(missingDataError);
      }
    }).catch(err => {
      if (!abortUpdate.signal.aborted) {
        console.error(err);
        setError(loadingError);
      }
    });

    return () => abortUpdate.abort();
  }, [reportId]);

  const update = (x: Readonly<L.LatLng>) => setCoords([x.lat, x.lng]);

  const mark = {
    coords: coords,
    desc: t("Report.Location"),
    icon: EmergencyType.values?.[type]?.icon ?? accidentIcon
  };

  return <MapView isLoaded={error !== undefined} center={coords} initialZoom={12} element={<ReportView update={setCoords} lat={coords[0]} lng={coords[1]} error={error} type={type} setType={setType} breathing={breathing} setBreathing={setBreathing} conscious={conscious} setConscious={setConscious} amountVictims={amountVictims} setAmountVictims={setAmountVictims} bandCode={bandCode} setBandCode={setBandCode} desc={desc} setDesc={setDesc} />} searchable clickable onClick={e => update(e)} onSearch={e => update(e.geocode.center)} marks={[mark]} />;
};

export default ReportForm;

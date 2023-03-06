import { MapViewHelperParams } from "../sharedViewsParams";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../hooks/useAbort";
import { createAmbulance } from "../../../api/ambulanceCalls";
import { unknownError, networkError, geolocationError } from "../sharedStrings";
import { Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import Length from "../../fragments/forms/api/Length";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { AmbulanceClass, AmbulanceType } from "../../../api/enumCalls";
import Number from "../../fragments/forms/api/Number";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";
import L from "leaflet";
import { ambulanceIcon } from "../map/MapIcons";
import MapView from "../../fragments/map/MapView";

// Ambulance form
const AmbulanceFormView = (props: Readonly<MapViewHelperParams>) => {
  const [licensePlate, setLicensePlate] = useState("");
  const [ambulanceClass, setAmbulanceClass] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState(props.error);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const abort = useAbort();

  // Update error message
  useEffect(() => setError(props.error), [props.error]);

  const onSubmit = () => {
    setError(undefined);
    const lng = props.lng;
    const lat = props.lat;

    createAmbulance({
      licensePlate: licensePlate,
      ambulanceClass: ambulanceClass,
      ambulanceType: ambulanceType,
      seats: seats,
      longitude: lng,
      latitude: lat
    }, abort).then(res => {
      if (res.ok) {
        navigate("/ambulances");
      } else if (res.status === 409) {
        setError("Ambulance.Exists");
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
    });
  };

  return (
    <Form onSubmit={onSubmit} className="w-50">
      <h1 className="my-3 text-center">{t("Ambulance.Adding")}</h1>
      <Length minLength={3} length={8} id="licensePlate" className="mb-3" label={t("Ambulance.LicensePlate")} required value={licensePlate} onChange={e => setLicensePlate(e.target.value)} />
      <EnumSelect id="ambulanceClass" className="mb-3" label={t("Ambulance.Class")} required enum={AmbulanceClass} value={ambulanceClass} onLoad={setAmbulanceClass} onChange={e => setAmbulanceClass(e.target.value)} />
      <EnumSelect id="ambulanceType" className="mb-3" label={t("Ambulance.Type")} required enum={AmbulanceType} value={ambulanceType} onLoad={setAmbulanceType} onChange={e => setAmbulanceType(e.target.value)} />
      <Number id="seats" className="mb-3" label={t("Ambulance.Seats")} required value={seats} minValue="1" onChange={e => setSeats(parseInt(e.target.value))} />
      <h4 className="text-center mb-3">{t("Map.Location")}</h4>
      <Number id="latitude" className="mb-3" value={props.lat} disabled />
      <Number id="longitude" className="mb-3" value={props.lng} disabled />
      <Row className="justify-content-center mt-3">
        <Submit className="w-75" canSubmit={error !== undefined}>{t("Ambulance.Add")}</Submit>
      </Row>
      <Error className="mt-3" error={error} />
    </Form>
  );
};

// Map view wrapper for ambulance form
const AmbulanceForm = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [error, setError] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => navigator.geolocation.getCurrentPosition(pos => {
    setCoords([pos.coords.latitude, pos.coords.longitude]);
    setError("");
  }, err => setError(geolocationError)), []);

  const update = (x: Readonly<L.LatLng>) => setCoords([x.lat, x.lng]);

  const mark = {
    coords: coords,
    desc: t("Ambulance.Ambulance"),
    icon: ambulanceIcon
  };

  return <MapView isLoaded={error !== undefined} center={coords} initialZoom={12} element={<AmbulanceFormView lat={coords[0]} lng={coords[1]} error={error} />} clickable onClick={e => update(e)} searchable onSearch={e => update(e.geocode.center)} marks={[mark]} />;
};

export default AmbulanceForm;

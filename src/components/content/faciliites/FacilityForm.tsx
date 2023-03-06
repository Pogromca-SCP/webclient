import { MapViewHelperParams } from "../sharedViewsParams";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRoles } from "../../../hooks/useAuth";
import { useAbort } from "../../../hooks/useAbort";
import { hasPerm, facilityManagement } from "../../../helpers/authHelper";
import { createFacility, updateFacility, getFacilityById, FacilityResponse } from "../../../api/facilityCalls";
import { unknownError, networkError, geolocationError, missingDataError, loadingError } from "../sharedStrings";
import { Row } from "react-bootstrap";
import Form from "../../fragments/forms/Form";
import NotBlank from "../../fragments/forms/api/NotBlank";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { FacilityType } from "../../../api/enumCalls";
import Number from "../../fragments/forms/api/Number";
import Submit from "../../fragments/forms/Submit";
import Error from "../../fragments/forms/Error";
import L from "leaflet";
import { hospitalIcon } from "../map/MapIcons";
import MapView from "../../fragments/map/MapView";

interface FacilityFormParams extends MapViewHelperParams {
  facilityType: string,
  setFacilityType: (x: string) => void,
  name: string,
  setName: (x: string) => void
}

// Facility form component
const FacilityFormView = (props: Readonly<FacilityFormParams>) => {
    const [error, setError] = useState(props.error);
    const { facilityId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const roles = useRoles();
    const abort = useAbort();
    const canEdit = hasPerm(roles, facilityManagement);

    // Update error message
    useEffect(() => setError(props.error), [props.error]);
  
    const onSubmit = () => {
      if (!canEdit) {
        console.error("You don't have permissions to submit this form.");
        return;
      }

      setError(undefined);
  
      const facility = {
        name: props.name,
        facilityType: props.facilityType,
        longitude: props.lng,
        latitude: props.lat
      };
  
      (facilityId === undefined ? createFacility(facility, abort) : updateFacility(parseInt(facilityId), facility, abort)).then(res => {
        if (res.ok) {
          navigate("../facilities");
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
        <h1 className="my-3 text-center">{facilityId === undefined ? t("Facility.Adding") : (canEdit ? t("Facility.Editing") : t("Facility.Facility"))}</h1>
        <NotBlank id="name" className="mb-3" required value={props.name} onChange={e => props.setName(e.target.value)} label={t("Facility.Name")} disabled={!canEdit} />
        <EnumSelect id="facilityType" className="mb-3" required value={props.facilityType} onChange={e => props.setFacilityType(e.target.value)} enum={FacilityType} onLoad={props.setFacilityType} label={t("Facility.Type")} disabled={!canEdit} />
        <h4 className="text-center mb-3">{t("Map.Location")}</h4>
        <Number id="latitude" className="mb-3" value={props.lat} disabled />
        <Number id="longitude" className="mb-3" value={props.lng} disabled />
        {canEdit ? (
          <Row className="justify-content-center mt-3">
            <Submit className="w-75" canSubmit={error !== undefined}>{facilityId === undefined ? t("Facility.Add") : t("Common.SaveChanges")}</Submit>
          </Row>
        ) : ""}
        <Error className="mt-3" error={error} />
      </Form>
    );
  };
  
  // Map wrapper for facility form
  const FacilityForm = () => {
    const [coords, setCoords] = useState<[number, number]>([0, 0]);
    const [facilityType, setFacilityType] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | undefined>("");
    const { t } = useTranslation();
    const { facilityId } = useParams();
    const roles = useRoles();
    const canEdit = hasPerm(roles, facilityManagement);

    // Loads facility data for editing
    useEffect(() => {
      setError(undefined);

      if (facilityId === undefined) {
        // Centers map view on current location
        navigator.geolocation.getCurrentPosition(pos => {
          setCoords([pos.coords.latitude, pos.coords.longitude]);
          setError("");
        }, err => setError(geolocationError));

        return;
      }
      
      const abortUpdate = new AbortController();

      getFacilityById(parseInt(facilityId), abortUpdate).then(res => res.json()).then((data: FacilityResponse) => {
        if (data.name && data.facilityType && data.location) {
          setName(data.name);
          setFacilityType(data.facilityType);
          setCoords([data.location.latitude, data.location.longitude]);
          setError("");
        } else {
          setError(missingDataError);
        }
      }).catch(err => {
        if (!abortUpdate.signal.aborted) {
          console.error(err);
          setError(loadingError);
        }
      });

      return () => abortUpdate.abort();
    }, [facilityId]);

    const update = (x: Readonly<L.LatLng>) => setCoords([x.lat, x.lng]);
  
    const mark = {
      coords: coords,
      desc: t("Facility.Facility"),
      icon: FacilityType.values?.[facilityType]?.icon ?? hospitalIcon
    };
  
    return <MapView isLoaded={error !== undefined} center={coords} initialZoom={12} element={<FacilityFormView lat={coords[0]} lng={coords[1]} facilityType={facilityType} setFacilityType={setFacilityType} name={name} setName={setName} error={error} />} clickable={canEdit} onClick={e => update(e)} searchable={canEdit} onSearch={e => update(e.geocode.center)} marks={[mark]} />;
  };
  
  export default FacilityForm;
  
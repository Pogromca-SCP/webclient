import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAbort } from "../../../../hooks/useAbort";
import { userEmailError, unknownError, networkError } from "../../sharedStrings";
import { getEmail } from "../../../../helpers/authHelper";
import { updateBlood } from "../../../../api/medicalInfoCalls";
import Form from "../../../fragments/forms/Form";
import EnumRadio from "../../../fragments/forms/api/EnumRadio";
import { BloodType, RhType } from "../../../../api/enumCalls";
import Error from "../../../fragments/forms/Error";
import Submit from "../../../fragments/forms/Submit";
import Button from "../../../fragments/util/Button";

export interface Blood {
  id?: number,
  bloodType?: string,
  rhType?: string
}

// Form component for editing blood data
const BloodTypeForm = (props: Readonly<Blood>) => {
  const [group, setGroup] = useState(props.bloodType);
  const [rh, setRh] = useState(props.rhType);
  const [readOnly, setReadOnly] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const { t } = useTranslation();
  const abort = useAbort();

  // Updates values when outside props are updated
  useEffect(() => {
    setGroup(props.bloodType);
    setRh(props.rhType);
  }, [props.bloodType, props.rhType]);

  const switchMode = (read: boolean) => {
    setReadOnly(read);
    setError("");
  };

  const reset = (message?: string) => {
    if (message) {
      console.error(message);
    }

    setGroup(props.bloodType);
    setRh(props.rhType);
    switchMode(true);
  };

  const onSubmit = () => {
    setError(undefined);

    if (readOnly) {
      switchMode(false);
      return;
    }

    if (!group || !rh) {
      setError("");
      return;
    }

    if (group === props.bloodType && rh === props.rhType) {
      switchMode(true);
      return;
    }

    if (!props.id) {
      reset("Blood is undefined. Check server responses for more info.");
      return;
    }

    const email = getEmail();

    if (!email) {
      reset(userEmailError);
      return;
    }

    updateBlood(props.id, {
      userEmail: email,
      bloodType: group,
      rhType: rh
    }, abort).then(res => {
      if (res.ok) {
        switchMode(true);
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

  const getError = (x?: string) => !readOnly && !x ? t("Error.EmptyValue") : undefined;

  return (
    <Form onSubmit={onSubmit}>
      <div className="mb-3">
        <h3>{t("Blood.Type")}</h3>
        <div>
          <EnumRadio labelClass="p-3" label={t("Blood.Type")}  enum={BloodType} onChange={e => setGroup(e.target.value)} value={group} disabled={readOnly} error={getError(group)} />
        </div>
        <div>
          <EnumRadio labelClass="p-3" label={t("Blood.Rh")}  enum={RhType} onChange={e => setRh(e.target.value)} value={rh} disabled={readOnly} error={getError(rh)} />
        </div>
        <Error className="w-25" error={error} />
        <Submit canSubmit={readOnly || error !== undefined}>{readOnly ? t("Common.Edit") : t("Common.Save")}</Submit>
        {readOnly ? "" : <Button type="button" onClick={e => reset()} className="mx-3">{t("Common.Cancel")}</Button>}
      </div>
    </Form>
  );
};

export default BloodTypeForm;

import { ValueViewParams } from "../sharedParams";
import { EnumType } from "../../../api/enumCalls";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useTranslation } from "react-i18next";

export interface EnumParams extends ValueViewParams {
  enum: EnumType
}

const Enum = (props: Readonly<EnumParams>) => {
  const darkMode = useDarkMode();
  const { t } = useTranslation();
  
  return <span style={{
    color: props.enum.values ? (darkMode ? props.enum.values[props.value].dark : props.enum.values[props.value].light) : undefined
  }}>{t(`${props.enum.name}.${props.value}`)}</span>;
};

export default Enum;

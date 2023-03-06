import L from "leaflet";
import { get } from "./basicCalls";
import { accidentIcon, floodIcon, fireIcon, placeholderIcon, heartIcon, suicideIcon, covidIcon, hospitalIcon, policeIcon, fireUnitIcon, guardIcon, aedIcon } from "../components/content/map/MapIcons";

export interface EnumValues {
  dark?: string,
  light?: string,
  markType?: MarkTypes,
  icon?: L.Icon<L.IconOptions> | L.DivIcon
}

export interface EnumType {
  getter: (abort: AbortController) => Promise<Response>,
  name: string,
  values?: Record<string, EnumValues>,
  available?: string
}

export enum MarkTypes {
  None = 0,
  Ambulance = 1,
  CarAccident = 2,
  Flood = 4,
  Fire = 8,
  Unknown = 16,
  HeartAttack = 32,
  Suicide = 64,
  Covid = 128,
  Hospital = 256,
  PoliceStation = 512,
  FireUnit = 1024,
  GuardUnit = 2048,
  Aed = 4096,
  All = 8191
}

const enumBase = "enum";

export const AllergyType = {
  getter: (abort: AbortController) => get(`${enumBase}/allergy_type`, abort),
  name: "AllergyType"
};

export const RhType = {
  getter: (abort: AbortController) => get(`${enumBase}/rh_type`, abort),
  name: "RhType"
};

export const BloodType = {
  getter: (abort: AbortController) => get(`${enumBase}/blood_type`, abort),
  name: "BloodType"
};

export const AmbulanceState: EnumType = {
  getter: (abort: AbortController) => get(`${enumBase}/ambulance_states`, abort),
  name: "AmbulanceStateType",
  values: {
    "FAILURE": {
      dark: "#ff0000",
      light: "#ff0000"
    },
    "MAINTENANCE": {
      dark: "#dd9900",
      light: "#dd9900"
    },
    "AVAILABLE": {
      dark: "#00aa00",
      light: "#00aa00"
    },
    "ON_ACTION": {
      dark: "#447700",
      light: "#447700"
    },
    "CREW_BRAKE": {
      dark: "#777777",
      light: "#777777"
    }
  },
  available: "AVAILABLE"
};

export const AmbulanceClass = {
  getter: (abort: AbortController) => get(`${enumBase}/ambulance_classes`, abort),
  name: "AmbulanceClass"
};

export const AmbulanceType = {
  getter: (abort: AbortController) => get(`${enumBase}/ambulance_types`, abort),
  name: "AmbulanceType"
};

export const EmergencyType: EnumType = {
  getter: (abort: AbortController) => get(`${enumBase}/emergency_type`, abort),
  name: "EmergencyType",
  values: {
    "CAR_ACCIDENT": {
      dark: "#00aa00",
      light: "#00aa00",
      markType: MarkTypes.CarAccident,
      icon: accidentIcon
    },
    "FLOOD": {
      dark: "#dd9900",
      light: "#dd9900",
      markType: MarkTypes.Flood,
      icon: floodIcon
    },
    "FIRE": {
      dark: "#ff0000",
      light: "#ff0000",
      markType: MarkTypes.Fire,
      icon: fireIcon
    },
    "UNKNOWN": {
      dark: "#777777",
      light: "#777777",
      markType: MarkTypes.Unknown,
      icon: placeholderIcon
    },
    "HEART_ATTACK": {
      dark: "#ff0000",
      light: "#ff0000",
      markType: MarkTypes.HeartAttack,
      icon: heartIcon
    },
    "SUICIDE": {
      dark: "#447700",
      light: "#447700",
      markType: MarkTypes.Suicide,
      icon: suicideIcon
    },
    "COVID": {
      dark: "#777777",
      light: "#777777",
      markType: MarkTypes.Covid,
      icon: covidIcon
    }
  }
};

export const FacilityType: EnumType = {
  getter: (abort: AbortController) => get(`${enumBase}/facility_type`, abort),
  name: "FacilityType",
  values: {
    "HOSPITAL": {
      markType: MarkTypes.Hospital,
      icon: hospitalIcon
    },
    "POLICE_STATION": {
      markType: MarkTypes.PoliceStation,
      icon: policeIcon
    },
    "FIRE_UNIT": {
      markType: MarkTypes.FireUnit,
      icon: fireUnitIcon
    },
    "GUARD_UNIT": {
      markType: MarkTypes.GuardUnit,
      icon: guardIcon
    },
    "AED": {
      markType: MarkTypes.Aed,
      icon: aedIcon
    }
  }
};

export const RoleName = {
  getter: (abort: AbortController) => get(`${enumBase}/roles`, abort),
  name: "RoleName"
};

export const IncidentType = {
  getter: (abort: AbortController) => get(`${enumBase}/incident_status`, abort),
  name: "IncidentStatusType",
  accepted: "ACCEPTED"
};

export const ItemType = {
  getter: (abort: AbortController) => get(`${enumBase}/item_types`, abort),
  name: "ItemType",
  singleUse: "SINGLE_USE",
  multiUse: "MULTI_USE",
  medical: "MEDICAL"
};

export const BackupType = {
  getter: (abort: AbortController) => get(`${enumBase}/backup_types`, abort),
  name: "BackupType"
};

export const TutorialType = {
  getter: (abort: AbortController) => get(`${enumBase}/tutorial_type`, abort),
  name: "TutorialType"
};

export const ItemUnit = {
  getter: (abort: AbortController) => get(`${enumBase}/item_unit_types`, abort),
  name: "ItemUnit"
};

export const EmployeeType = {
  getter: (abort: AbortController) => get(`${enumBase}/employee_types`, abort),
  name: "EmployeeType",
  dispatcher: "DISPATCHER",
  medic: "MEDIC",
  manager: "AMBULANCE_MANAGER"
};

export const VictimStatus = {
  getter: (abort: AbortController) => get(`${enumBase}/victim_statuses`, abort),
  name: "VictimStatus"
};

export const Gender = {
  getter: (abort: AbortController) => get(`${enumBase}/genders`, abort),
  name: "Gender"
};

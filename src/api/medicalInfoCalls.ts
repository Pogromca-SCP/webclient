import { AllergyResponse } from "./allergyCalls";
import { DiseaseResponse } from "./diseaseCalls";
import { get, post, put, del } from "./basicCalls";

interface BloodBase {
  // Enum - RhType
  rhType: string,

  // Enum - BloodType
  bloodType: string
}

export interface BloodRequest extends BloodBase {
  // Email
  userEmail: string
}

export interface MedicalInfoResponse extends BloodBase {
  medicalInfoId: number,
  allergies: AllergyResponse[],
  diseases: DiseaseResponse[]
}

const medicalInfoBase = "medical_info";
export const getMedicalInfoByEmail = (email: string, abort: AbortController) => get(`${medicalInfoBase}/user/${email}`, abort);
export const getMedicalInfoByBandCode = (bandCode: string, abort: AbortController) => get(`${medicalInfoBase}/user/bandcode/${bandCode}`, abort);
export const deleteMedicalInfo = (id: number, abort: AbortController) => del(`${medicalInfoBase}/${id}`, abort);

export const getBloodById = (id: number, abort: AbortController) => get(`${medicalInfoBase}/blood/${id}`, abort);
export const createBlood = (req: Readonly<BloodRequest>, abort: AbortController) => post(`${medicalInfoBase}/blood`, req, abort);
export const updateBlood = (id: number, req: Readonly<BloodRequest>, abort: AbortController) => put(`${medicalInfoBase}/blood/${id}`, req, abort);
export const deleteBlood = (id: number, abort: AbortController) => del(`${medicalInfoBase}/blood/${id}`, abort);

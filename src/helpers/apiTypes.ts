// Base url for requests, change to 'http://localhost:8080' if you want to test with local backend
export const baseUrl = "http://172.21.40.111:8080";

// API dto types definitions
export interface LoginRequest {
  username: string,
  password: string
}

export interface CreateUserRequest extends LoginRequest {
  firstName: string,
  lastName: string,
  email: string,
  birthDate: Date,
  phoneNumber: string
}

export interface CreateStaffRequest extends CreateUserRequest {
  staffType: StaffType
}

export interface CreateEmergencyRequest {
  description: string,
  breathing: boolean,
  conscious: boolean,
  bloodType: BloodType
}

export interface ApproveEmergencyRequest {
  ambulanceIds: number[],
  dangerRating: number
}

export interface AmbulanceDto {
  numberOfSeats: number,
  fuelTankCapacity: number,
  licensePlates: string,
  type: AmbulanceType,
  kind: AmbulanceKind
}

export interface AmbulanceResponse extends AmbulanceDto {
  availability: AmbulanceAvailability
}

export interface AmbulanceAvailabilityDto {
  availabilityType?: AvailabilityType,
  since?: Date,
  to?: Date,
  details?: string
}

export interface EquipmentDto {
  name?: string
}

// API enums definitions
export enum AdditionalServicesType {
  POLICE,
  FIREFIGHTERS,
  GAS_EMERGENCY,
  ARMY,
  SECURITY,
  CUSTOMS,
  ANTI_TERRORISTS,
  SAPERS
}

export enum AmbulanceKind {
  S,
  P,
  N,
  T,
  COVID
}

export enum AmbulanceType {
  A,
  B,
  C
}

export enum AvailabilityType {
  AVAILABLE,
  REFUEL,
  ON_ACTION,
  BREAK,
  MALFUNCTION
}

export enum BloodType {
  A_PLUS,
  AB_PLUS,
  O_PLUS,
  A_MINUS,
  AB_MINUS,
  O_MINUS,
  UNKNOWN
}

export enum FacilityType {
  HOSPITAL,
  POLICE_STATION,
  FIREFIGHTER_STATION
}

export enum HospitalType {
  SPECIALISTIC,
  MILITARY,
  DISTRICT,
  VOIVODESHIP
}

export enum StaffType {
  DISPOSITOR,
  MANAGER,
  PARAMEDIC
}

export enum TutorialKind {
  COURSE,
  FILE_EMERGENCE,
  GUIDE
}

// API types definitions
export interface AccidentReport {
  id?: number,
  dangerRating?: number,
  date?: Date,
  closed?: boolean,
  staff?: Staff,
  user?: User,
  ambulances?: Ambulance[],
  reportSurvey?: ReportSurvey
}

export interface AdditionalServices {
  id?: number,
  additionalServicesType?: AdditionalServicesType,
  date?: Date,
  justification?: string
}

export interface Ambulance {
  id?: number,
  ambulanceKind?: AmbulanceKind,
  ambulanceType?: AmbulanceType,
  fuelCapacity?: number,
  peopleCapacity?: number,
  plates?: string
}

export interface AmbulanceAvailability {
  id?: number,
  ambulance?: Ambulance,
  availabilityType?: AvailabilityType,
  dateStart?: Date,
  dateEnd?: Date,
  details?: string
}

export interface DispositorDutyEntry {
  id?: number,
  dutyStart?: number,
  dutyEnd?: number,
  comment?: string,
  staff?: Staff
}

export interface Equipment {
  id?: number,
  name?: string
}

export interface EquipmentLog {
  id?: number,
  equipment?: Equipment,
  ambulance?: Ambulance,
  dateStart?: Date,
  dateEnd?: Date,
  startingAmount?: number,
  currentAmount?: number,
  measurement?: string
}

export interface Facility {
  id?: number,
  name?: string,
  hospitalType?: HospitalType,
  facilityType?: FacilityType,
  set?: string[],
  maximumBeds?: number
}

export interface Location {
  id?: number,
  longitude?: number,
  latitude?: number
}

export interface MedicalInfo {
  id?: number,
  bloodType?: BloodType,
  chronicDiseases?: string,
  allergies?: string
}

export interface ReportSurvey {
  id?: number,
  victimBreathing?: boolean,
  victimConsious?: boolean,
  description?: string,
  date?: Date,
  fileUrl?: string[],
  bloodType?: BloodType
}

export interface Review {
  id?: number,
  rating?: number,
  content?: string
}

export interface Staff {
  id?: string,
  firstName?: string,
  lastName?: string,
  birthDate?: Date,
  phone?: string,
  staffType?: StaffType
}

export interface Tutorial {
  id?: number,
  name?: string,
  tutorialKind?: TutorialKind,
  average?: number
}

export interface User {
  id?: string,
  firstName?: string,
  lastName?: string,
  birthDate?: Date,
  phone?: string,
  bandCode?: string,
  medicalInfo?: MedicalInfo
}

export interface Victim {
  id?: number,
  firstName?: string,
  lastName?: string,
  documentName?: string,
  documentId?: string,
  medicalInfo?: MedicalInfo
}

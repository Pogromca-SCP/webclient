import { SignupRequest } from "./authCalls";
import { Schedule } from "./sharedTypes";
import { post } from "./basicCalls";

export interface RegisterEmployeeRequest extends SignupRequest {
  workSchedule: Schedule
}

const adminBase = "admin";
export const registerEmployee = (employeeType: string, req: Readonly<RegisterEmployeeRequest>, abort: AbortController) => post(`${adminBase}/register/employee/${employeeType}`, req, abort);

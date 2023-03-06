import { get, post, put, del } from "./basicCalls";

export interface BackupUpdateRequest {
  accepted: boolean,

  // Not blank
  justification: string,

  // Enum - BackupType
  backupType: string
}

export interface BackupAddRequest extends BackupUpdateRequest {
  // Email
  requester: string,

  // Integer
  incidentId: number
}

export interface BackupResponse extends BackupUpdateRequest {
  backupId: number,
  incidentId: number,
  time: Date
}

const backupBase = "backup";
export const getBackupById = (id: number, abort: AbortController) => get(`${backupBase}/${id}`, abort);
export const getBackups = (abort: AbortController) => get(backupBase, abort);
export const addBackup = (req: Readonly<BackupAddRequest>, abort: AbortController) => post(backupBase, req, abort);
export const updateBackup = (id: number, req: Readonly<BackupUpdateRequest>, abort: AbortController) => put(`${backupBase}/${id}`, req, abort);
export const deleteBackup = (id: number, abort: AbortController) => del(`${backupBase}/${id}`, abort);

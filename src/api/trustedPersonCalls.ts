import { get, del, post, put } from "./basicCalls";

interface TrustedPersonBase {
  // Not blank
  firstName: string,

  // Not blank
  lastName: string,

  // Email
  email: string | null,

  // Phone
  phone: string
}

export interface TrustedPersonRequest extends TrustedPersonBase {
  // Email
  userEmail: string
}

export interface TrustedPersonResponse extends TrustedPersonBase {
  trustedId: number
}

const trustedBase = "trusted";
export const getTrustedPersons = (abort: AbortController) => get(trustedBase, abort);
export const getTrustedPersonByEmail = (email: string, abort: AbortController) => get(`${trustedBase}/${email}`, abort);
export const deleteTrustedPerson = (email: string, abort: AbortController) => del(`${trustedBase}/${email}`, abort);
export const createTrustedPerson = (req: Readonly<TrustedPersonRequest>, abort: AbortController) => post(trustedBase, req, abort);
export const updateTrustedPerson = (req: Readonly<TrustedPersonRequest>, abort: AbortController) => put(trustedBase, req, abort);

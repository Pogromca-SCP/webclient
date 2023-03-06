import { get, post, put, del } from "./basicCalls";

export interface ItemBase {
  // Not blank
  // All
  name?: string,

  // Not blank
  // Not in MULTI_USE
  description?: string,

  // Not blank
  // Not in SINGLE_USE and MULTI_USE
  manufacturer?: string
}

export interface UpdateItemRequest extends ItemBase {
  // Datetime
  // Only in MEDICAL
  expirationDate?: Date
}

export interface ItemRequest extends ItemBase {
  // Enum - ItemType
  type: string,

  // Datetime
  // Only in MEDICAL
  expiration_date?: Date
}

export interface ItemResponse extends UpdateItemRequest {
  itemId: number,
  type: string
}

export interface ItemContainer {
  count: number,
  unit: string,
  updatedAt: Date
}

export interface EquipmentResponse {
  item: ItemResponse,
  itemData: ItemContainer
}

const itemBase = "item";
export const getItems = (abort: AbortController) => get(itemBase, abort);
export const getItemById = (id: number, abort: AbortController) => get(`${itemBase}/${id}`, abort);
export const createItem = (req: Readonly<ItemRequest>, abort: AbortController) => post(`${itemBase}/create`, req, abort);
export const updateItem = (id: number, req: Readonly<UpdateItemRequest>, abort: AbortController) => put(`${itemBase}/edit/${id}`, req, abort);
export const deleteItem = (id: number, abort: AbortController) => del(`${itemBase}/delete/${id}`, abort);

// Contains type definitions shared in form components
import { InnerClassParam } from "../sharedParams"
import { ChangeEventHandler } from "react"

export interface ControlBaseParams<T> extends InnerClassParam {
  label?: string,
  required?: boolean,
  onChange?: ChangeEventHandler<T>,
  disabled?: boolean,
  error?: string
}

export interface IdControlParams<T> extends ControlBaseParams<T> {
  id?: string
}

export interface TextBasedInputControlParams<T> extends IdControlParams<T> {
  labelClass?: string,
  value?: string | number | string[]
}

export interface RawInputControlParams<T> extends TextBasedInputControlParams<T> {
  placeholder?: string
}

export interface TextControlParams<T> extends RawInputControlParams<T> {
  minLength?: number,
  maxLength?: number
}

export type RawTextControlParams = RawInputControlParams<HTMLInputElement | HTMLTextAreaElement>;
export type RadioControlParams = ControlBaseParams<HTMLInputElement>;
export type SelectControlParams = TextBasedInputControlParams<HTMLSelectElement>;

export interface NumberControlParams extends RawTextControlParams {
  minValue?: string | number,
  maxValue?: string | number,
  step?: string | number
}

export interface DateControlParams extends RawTextControlParams {
  withTime?: boolean
}

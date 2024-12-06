import type { GlobalAttr, targetValues } from "./attr";
import {
  createE,
  createS,
  type HtmlElement_Or_Text_Children_Or_Undefined,
} from "./elem";

type inputRequired = {
  type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  /**   @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#name
        '_charset_' combined with hidden will set the value to the 'user-agent'
        'isindex' is not allowed as name
         */
  name: string | "_charset_";
  id: string;
};

const inputTypes = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "password",
  "radio",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week",
] as const;
type inputType = (typeof inputTypes)[number];

type SteppableAttr = { value: string; max: string; min: string; step: string };
type LengthAble = { value: string; maxlength: string; minlength: string };
type InputAttr<inputType> = {
  id: string;
  name: string;
  /**  Tell the browser the input has a valid value before it can be submitted.
    NOT VALID ON: hidden, range, color, and buttons.
    @TODO might be fixed in later version  */
  required?: "required";
} & GlobalAttr &
  (inputType extends "button"
    ? { type: "button"; value: string }
    : inputType extends "checkbox"
      ? {
          type: "checkbox";
          value: string;
          checked?: "checked";
        }
      : inputType extends "color"
        ? { type: "color"; value?: string }
        : inputType extends "date"
          ? {
              type: "date";
            } & Partial<SteppableAttr>
          : inputType extends "datetime-local"
            ? {
                type: "datetime-local";
              } & Partial<SteppableAttr>
            : inputType extends "email"
              ? {
                  type: "email";
                  multiple?: "multiple";
                  pattern?: string;
                  placeholder?: string;
                  readonly?: "readonly";
                  size?: string;
                  list?: string;
                } & Partial<LengthAble>
              : inputType extends "file"
                ? {
                    type: "file";
                    value: "";
                    accept?: "string";
                    capture?: "user" | "environment";
                    multiple?: "multiple";
                    webkitdirectory?: "webkitdirectory";
                  }
                : inputType extends "hidden"
                  ? {
                      type: "hidden";
                      // if the value is '_charset_' it will set the user-agent as value
                      value: string | "_charset_";
                    }
                  : inputType extends "image"
                    ? {
                        type: "image";
                        src?: string;
                        alt?: string;
                        formaction?: string;
                        formenctype?:
                          | "application/x-www-form-urlencoded"
                          | "multipart/form-data"
                          | "text/plain";
                        formmethod?: "get" | "post" | "dialog";
                        formnovalidate?: "formnovalidate";
                        formtarget?: targetValues;
                      }
                    : inputType extends "month"
                      ? {
                          type: "month";
                          readonly?: "readonly";
                          list?: string;
                        } & Partial<SteppableAttr>
                      : inputType extends "nubmer"
                        ? {
                            type: "number";
                            list?: string;
                            placeholder?: string;
                            readonly?: "readonly";
                          } & Partial<SteppableAttr>
                        : inputType extends "password"
                          ? {
                              type: "password";
                              pattern?: string;
                              /* please use minlength and maxlength in CSS instead*/
                              size?: string;
                              readonly?: "readonly";
                              placeholder?: string;
                              autocomplete?:
                                | "on"
                                | "off"
                                | "current-password"
                                | "new-password";
                            } & Partial<LengthAble>
                          : inputType extends "radio"
                            ? {
                                type: "radio";
                                checked?: "checked";
                              }
                            : inputType extends "range"
                              ? {
                                  type: "range";
                                  list: string;
                                  orient?: "horizontal" | "vertical";
                                } & SteppableAttr
                              : inputType extends "reset"
                                ? {
                                    type: "reset";
                                  }
                                : inputType extends "search"
                                  ? {
                                      type: "search";
                                      value?: string;
                                      list: string;
                                      pattern: string;
                                      placeholder: string;
                                      readonly: "readonly";
                                      size: string;
                                      autocorrect?: "on" | "off";
                                      incremental?: "incremental";
                                      results?: string;
                                    } & Partial<LengthAble>
                                  : inputType extends "submit"
                                    ? {
                                        type: "submit";
                                        value: string;
                                        disabled?: "disabled";
                                        formenctype?:
                                          | "application/x-www-form-urlencoded"
                                          | "multipart/form-data"
                                          | "text/plain";
                                        formmethod?: "get" | "post" | "dialog";
                                        formnovalidate?: "formnovalidate";
                                        formtarget: targetValues;
                                      }
                                    : inputType extends "tel"
                                      ? {
                                          type: "tel";
                                          list?: string;
                                          readonly?: "readonly";
                                          size?: string;
                                          pattern?: string;
                                        } & Partial<LengthAble>
                                      : inputType extends "text"
                                        ? {
                                            type: "text";
                                            list?: string;
                                            pattern?: string;
                                            readonly?: "readonly";
                                            placeholder?: string;
                                          } & Partial<LengthAble>
                                        : inputType extends "time"
                                          ? {
                                              type: "time";
                                              list?: string;
                                              readonly: "readonly";
                                            } & Partial<SteppableAttr>
                                          : inputType extends "url"
                                            ? {
                                                type: "url";
                                                list?: string;
                                                pattern: string;
                                                placeholder: string;
                                                readonly?: "readonly";
                                              } & Partial<LengthAble>
                                            : inputType extends "week"
                                              ? {
                                                  type: "week";
                                                  readonly?: "readonly";
                                                } & Partial<SteppableAttr>
                                              : {
                                                  type: "Error something went wrong ????";
                                                });

export const Input = (attrs: InputAttr<inputType>) => createS("input", attrs);

type LabelAttr = GlobalAttr & { for: string };

export const Label = (
  attrs: LabelAttr,
  children?: HtmlElement_Or_Text_Children_Or_Undefined
) => createE("label", attrs, children);

export const TextArea = (
  attrs: GlobalAttr &
    Partial<LengthAble> &
    Partial<{ cols: number; rows: number; required: "required" }> &
    Partial<{ name: string; id: string; value: string }>
) => {
  createS("textarea", attrs);
};

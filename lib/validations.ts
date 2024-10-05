import { UseFormReturn } from "react-hook-form";
import {
  ZodBoolean,
  ZodDate,
  ZodNullable,
  ZodNumber,
  ZodOptional,
  ZodString,
  z,
} from "zod";

export const parseString = (pipes: ZodString) =>
  z
    .string()
    .transform((value) => value.trim())
    .pipe(pipes);

export const parseOptionalString = (pipes: ZodOptional<ZodString>) =>
  z
    .string()
    .optional()
    .transform((value) => (value ? value.trim() : ""))
    .transform((value) => (value !== "" ? value : undefined))
    .pipe(pipes);

export const parseNumber = (pipes: ZodNumber | ZodOptional<ZodNumber>) =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) =>
      typeof value === "string" ? parseFloat(value) : value,
    )
    .transform((value) =>
      typeof value !== "undefined" && !isNaN(value) ? value : undefined,
    )
    .pipe(pipes);

export const parseNumberNullable = (
  pipes:
    | ZodNumber
    | ZodOptional<ZodNumber>
    | ZodOptional<ZodNullable<ZodNumber>>,
) =>
  z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((value) =>
      typeof value === "string" ? parseFloat(value) : value,
    )
    .transform((value) =>
      typeof value !== "undefined" && value !== null && !isNaN(value)
        ? value
        : null,
    )
    .pipe(pipes);

export const parseBoolean = (pipes: ZodBoolean | ZodOptional<ZodBoolean>) =>
  z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((value) => (typeof value === "boolean" ? value : undefined))
    .pipe(pipes);

export const parseDate = (pipes: ZodDate | ZodOptional<ZodDate>) =>
  z
    .union([z.null(), z.date()])
    .optional()
    .transform((value) => (value instanceof Date ? value : undefined))
    .pipe(pipes);

export function setValidationErrors(
  validationErrors: any[],
  form: UseFormReturn<any>,
) {
  validationErrors.forEach((errorItem, index) => {
    form.setError(
      errorItem.property,
      {
        type: "custom",
        message: errorItem.constraints[Object.keys(errorItem.constraints)[0]],
      },
      { shouldFocus: index === 0 },
    );
  });
}
export const parseStringWithWhitespace = (pipes: ZodString) =>
  z
    .string()
    .refine((value) => !/^\s|\s$/.test(value), {
      message: "Leading or trailing white spaces are not allowed",
    })
    .pipe(pipes);

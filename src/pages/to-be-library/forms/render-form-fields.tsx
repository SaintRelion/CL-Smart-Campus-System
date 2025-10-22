"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type {
  RenderFormFieldConfigs,
  RenderFormFieldValues,
} from "./render-form-fields-model";
import { getValidationRules } from "./lib/render-form-utils";
import { formatDate } from "./lib/date-utils";

type RenderFormFieldsProps = {
  fields: RenderFormFieldConfigs[];
  wrapperClass?: string;
  defaultValues?: Record<string, RenderFormFieldValues>;
};

export const RenderFormFields = ({
  fields,
  wrapperClass = "grid grid-cols-2 space-x-2 space-y-2",
  defaultValues,
}: RenderFormFieldsProps) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (!defaultValues) return;

    fields.forEach((field) => {
      const key = field.name;
      const val = defaultValues?.[key];

      if (val !== undefined && val !== null) {
        if (field.type == "date")
          setValue(key, formatDate(new Date(val.toString())));
        else setValue(key, val);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={wrapperClass}>
        {fields.map((field) => {
          const fieldName = field.name;
          const inputClassName =
            "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

          const rules = getValidationRules(field);
          return (
            <div key={fieldName}>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor={fieldName}
              >
                {field.label}
              </label>

              {["text", "email", "number", "password"].includes(field.type) && (
                <input
                  type={field.type}
                  {...register(fieldName, rules)}
                  className={inputClassName}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  {...register(fieldName, rules)}
                  placeholder={field.placeholder || field.label}
                />
              )}

              {field.type === "select" && (
                <Select
                  {...register(fieldName, rules)}
                  defaultValue={defaultValues?.[fieldName].toString() ?? ""}
                  onValueChange={(val) =>
                    setValue(fieldName, val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(field.options).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "checkbox" &&
                (Array.isArray(field.options) ? (
                  <div className="flex flex-wrap gap-3">
                    {field.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          {...register(fieldName, rules)}
                          className="accent-primary h-4 w-4"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={fieldName}
                      {...register(fieldName, rules)}
                      className="accent-primary h-4 w-4"
                    />
                    <label htmlFor={fieldName} className="text-sm">
                      {field.label}
                    </label>
                  </div>
                ))}

              {field.type === "datetime-local" && (
                <input
                  type="datetime-local"
                  placeholder="Select a DateTime"
                  {...register(fieldName, rules)}
                  className={inputClassName}
                />
              )}

              {field.type === "time" && (
                <input
                  type="time"
                  placeholder="Select a Time"
                  {...register(fieldName, rules)}
                  className={inputClassName}
                />
              )}

              {field.type === "date" && (
                <input
                  type="date"
                  placeholder="Select a Date"
                  {...register(fieldName, rules)}
                  className={inputClassName}
                />
              )}

              {field.type === "file" && (
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.csv,.zip,.txt"
                  {...register(fieldName, rules)}
                  className={inputClassName}
                />
              )}

              {field.type === "image" && (
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  {...register(fieldName, rules)}
                  className={inputClassName}
                />
              )}

              {errors[fieldName] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[fieldName]?.message?.toString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input/min";
import parsePhoneNumber from "libphonenumber-js/min";
import "react-phone-number-input/style.css";
import { FormField, FormInput, FormTextarea } from "@/components/ui/Form";
import { SplitButton } from "@/components/ui/SplitButton";
import { submitContactForm } from "@/lib/actions/contact";

const schema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less")
    .refine((val) => /^[a-zA-Z\s]*$/.test(val), "First name must contain only letters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less")
    .refine((val) => /^[a-zA-Z\s]*$/.test(val), "Last name must contain only letters"),
  email: z.string()
    .min(1, "Email is required")
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(16, "Phone number is too long")
    .refine((val) => isValidPhoneNumber(val), "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function ConnectForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const nameField = (field: "firstName" | "lastName") => {
    const reg = register(field);
    return {
      ...reg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        reg.onChange(e);
      },
    };
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    const parsed = parsePhoneNumber(data.phone);
    const result = await submitContactForm({
      page_name: "About Us",
      page_url: "/about-us",
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_country_code: parsed ? `+${parsed.countryCallingCode}` : "",
      phone_number: parsed?.nationalNumber ?? data.phone,
      message: data.message,
    });

    if (result.success) {
      setIsSuccess(true);
    } else {
      setServerError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint">
          <svg
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-h3 text-primary">Thank you!</h3>
        <p className="text-body text-secondary">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.firstName?.message}>
          <FormInput
            placeholder="First Name"
            hasError={!!errors.firstName}
            {...nameField("firstName")}
          />
        </FormField>
        <FormField error={errors.lastName?.message}>
          <FormInput
            placeholder="Last Name"
            hasError={!!errors.lastName}
            {...nameField("lastName")}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.email?.message}>
          <FormInput
            type="email"
            placeholder="Email"
            hasError={!!errors.email}
            {...register("email")}
          />
        </FormField>
        <FormField error={errors.phone?.message}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                onChange={(val) => {
                  if (!val || val.length <= 16) field.onChange(val);
                }}
                defaultCountry="IN"
                international
                maxLength={20}
                className={`connect-phone-input${errors.phone ? " connect-phone-input--error" : ""}`}
              />
            )}
          />
        </FormField>
      </div>

      <FormField error={errors.message?.message}>
        <FormTextarea
          placeholder="Message"
          rows={5}
          hasError={!!errors.message}
          {...register("message")}
        />
      </FormField>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <SplitButton
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full cursor-pointer"
        labelClassName="flex-1 justify-center"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </SplitButton>
    </form>
  );
}

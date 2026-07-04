"use client";

import { useState } from "react";
import { useForm, Controller, type UseFormRegister, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input/min";
import parsePhoneNumber from "libphonenumber-js/min";
import "react-phone-number-input/style.css";
import { FormField, FormInput, FormTextarea } from "@/components/ui/Form";
import { SplitButton } from "@/components/ui/SplitButton";
import { submitContactForm } from "@/lib/actions/contact";
import { submitWhiteLabelContactForm } from "@/lib/actions/white-label-contact";
import type { ConnectFormProps } from "./ConnectSection.types";

// ─── Shared field validators ──────────────────────────────────────────────────

const emailField = z
  .string()
  .min(1, "Email is required")
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address");

const phoneField = z
  .string()
  .min(1, "Phone number is required")
  .max(16, "Phone number is too long")
  .refine((v) => isValidPhoneNumber(v), "Enter a valid phone number");

const messageField = z.string().min(10, "Message must be at least 10 characters");

const nameOnly = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(100, `${label} must be 100 characters or less`)
    .refine((v) => /^[a-zA-Z\s]+$/.test(v.trim()), `${label} must contain only letters`);

// ─── About variant ────────────────────────────────────────────────────────────

const aboutSchema = z.object({
  firstName: nameOnly("First name").max(50, "First name must be 50 characters or less"),
  lastName:  nameOnly("Last name").max(50, "Last name must be 50 characters or less"),
  email:     emailField,
  phone:     phoneField,
  message:   messageField,
});

type AboutValues = z.infer<typeof aboutSchema>;

function AboutForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", message: "" },
  });

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

  const onSubmit = async (data: AboutValues) => {
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
    if (result.success) setIsSuccess(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
  };

  if (isSuccess) {
    return <SuccessState title="Submission Successful" message="Thank you for showing interest in partnering with Torque Pharma. Our team will connect with you soon." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.firstName?.message}>
          <FormInput placeholder="First Name" hasError={!!errors.firstName} {...nameField("firstName")} />
        </FormField>
        <FormField error={errors.lastName?.message}>
          <FormInput placeholder="Last Name" hasError={!!errors.lastName} {...nameField("lastName")} />
        </FormField>
      </div>
      <SharedEmailPhoneRow errors={errors} register={register} control={control as Control<any>} />
      <SharedMessageRow errors={errors} register={register} />
      <ServerError message={serverError} variant="light" />
      <SubmitButton isSubmitting={isSubmitting} label="Submit" />
    </form>
  );
}

// ─── White-label variant ──────────────────────────────────────────────────────

const whiteLabelSchema = z.object({
  fullName:    nameOnly("Full name"),
  companyName: z.string().min(1, "Company name is required").max(100, "Company name must be 100 characters or less"),
  email:       emailField,
  phone:       phoneField,
  message:     messageField,
});

type WhiteLabelValues = z.infer<typeof whiteLabelSchema>;

function WhiteLabelForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WhiteLabelValues>({
    resolver: zodResolver(whiteLabelSchema),
    defaultValues: { fullName: "", companyName: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (data: WhiteLabelValues) => {
    setServerError("");
    const parsed = parsePhoneNumber(data.phone);
    const result = await submitWhiteLabelContactForm({
      page_name: "WHITE LABEL MANUFACTURING",
      page_url: "/white-label-manufacturing",
      full_name: data.fullName,
      company_name: data.companyName,
      email: data.email,
      phone_country_code: parsed ? `+${parsed.countryCallingCode}` : "",
      phone_number: parsed?.nationalNumber ?? data.phone,
      message: data.message,
    });
    if (result.success) setIsSuccess(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
  };

  if (isSuccess) {
    return <SuccessState title="Request Received" message="Thank you for your interest in our white label manufacturing services. Our team will be in touch shortly." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.fullName?.message}>
          <FormInput placeholder="Full Name" hasError={!!errors.fullName} className="!bg-white" {...register("fullName")} />
        </FormField>
        <FormField error={errors.companyName?.message}>
          <FormInput placeholder="Company Name" hasError={!!errors.companyName} className="!bg-white" {...register("companyName")} />
        </FormField>
      </div>
      <SharedEmailPhoneRow errors={errors} register={register} control={control as Control<any>} white />
      <SharedMessageRow errors={errors} register={register} white />
      <ServerError message={serverError} variant="dark" />
      <SubmitButton isSubmitting={isSubmitting} label="Request a Quote" />
    </form>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SharedRowProps = {
  errors: Record<string, { message?: string } | undefined>;
  register: UseFormRegister<any>;
  control?: Control<any>;
  white?: boolean;
};

function SharedEmailPhoneRow({ errors, register, control, white }: SharedRowProps) {
  const inputCls = white ? "!bg-white" : "";
  const phoneCls = white
    ? "connect-phone-input connect-phone-input--white"
    : "connect-phone-input";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField error={errors.email?.message}>
        <FormInput
          type="email"
          placeholder="Email"
          hasError={!!errors.email}
          className={inputCls}
          {...register("email")}
        />
      </FormField>
      <FormField error={errors.phone?.message}>
        <Controller
          name="phone"
          control={control!}
          render={({ field }) => (
            <PhoneInput
              {...field}
              onChange={(val) => {
                if (!val || val.length <= 16) field.onChange(val);
              }}
              defaultCountry="IN"
              international
              maxLength={20}
              className={`${phoneCls}${errors.phone ? " connect-phone-input--error" : ""}`}
            />
          )}
        />
      </FormField>
    </div>
  );
}

function SharedMessageRow({ errors, register, white }: Omit<SharedRowProps, "control">) {
  return (
    <FormField error={errors.message?.message}>
      <FormTextarea
        placeholder="Message"
        rows={6}
        hasError={!!errors.message}
        className={white ? "!bg-white" : ""}
        {...register("message")}
      />
    </FormField>
  );
}

function ServerError({ message, variant }: { message: string; variant: "light" | "dark" }) {
  if (!message) return null;
  return variant === "dark"
    ? <p className="rounded-lg bg-red-900/40 px-4 py-3 text-sm text-red-300">{message}</p>
    : <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p>;
}

function SubmitButton({ isSubmitting, label }: { isSubmitting: boolean; label: string }) {
  return (
    <SplitButton
      type="submit"
      variant="primary"
      disabled={isSubmitting}
      className="w-full cursor-pointer"
      labelClassName="flex-1 justify-center"
    >
      {isSubmitting ? "Sending..." : label}
    </SplitButton>
  );
}

function SuccessState({ title, message }: { title: string; message: string }) {
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
      <h3 className="font-heading text-h3 text-primary">{title}</h3>
      <p className="text-body text-secondary">{message}</p>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function ConnectForm({ variant }: ConnectFormProps) {
  if (variant === "white-label") return <WhiteLabelForm />;
  return <AboutForm />;
}

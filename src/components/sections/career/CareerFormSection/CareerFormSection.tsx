"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input/min";
import parsePhoneNumber from "libphonenumber-js/min";
import "react-phone-number-input/style.css";
import { FormField, FormInput, FormTextarea } from "@/components/ui/Form";
import { SplitButton } from "@/components/ui/SplitButton";
import { submitCareerApplication } from "@/lib/actions/career-application";
import type { CareerFormSectionProps } from "./CareerFormSection.types";

// ─── Options ─────────────────────────────────────────────────────────────────

const APPLYING_FOR_OPTIONS = [
  "Research & Development",
  "Manufacturing & Operations",
  "Sales & Marketing",
  "International Business & Exports",
  "Supply Chain & Logistics",
  "Corporate Functions",
  "Other",
] as const;

// ─── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  fullName:        z.string().min(1, "Full name is required").refine((v) => /^[a-zA-Z\s]+$/.test(v.trim()), "Letters only"),
  email:           z.string().min(1, "Email is required").refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email"),
  phone:           z.string().min(1, "Phone is required").refine((v) => isValidPhoneNumber(v), "Enter a valid phone number"),
  currentLocation: z.string().min(1, "Location is required"),
  applyingFor:     z.string().min(1, "Please select a role"),
  experience:      z.string().min(1, "Experience is required"),
  linkedinUrl:     z.string().optional(),
  message:         z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

// ─── Select ───────────────────────────────────────────────────────────────────

function FormSelect({
  hasError,
  onChange,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  const [hasValue, setHasValue] = useState(false);

  return (
    <div className="relative">
      <select
        onChange={(e) => {
          setHasValue(!!e.target.value);
          onChange?.(e);
        }}
        className={`w-full appearance-none min-h-[52px] rounded-lg bg-surface px-4 py-3 text-body outline-none transition-colors focus:ring-1 focus:ring-primary/30 ${
          hasValue ? "text-primary" : "text-secondary/60"
        } ${hasError ? "ring-1 ring-red-500" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

// ─── Success ─────────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint">
        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-heading text-h3 text-primary">Application Submitted</h3>
      <p className="text-body text-secondary">Thank you for applying. Our talent team will review your application and get back to you shortly.</p>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function CareerFormSection({ title, disclaimer, className = "" }: CareerFormSectionProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [resumeFile, setResumeFile] = useState<{ filename: string; base64: string } | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "", email: "", phone: "", currentLocation: "",
      applyingFor: "", experience: "", linkedinUrl: "", message: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setFileError("File size must not exceed 15MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = (ev.target?.result as string).split(",")[1];
      setResumeFile({ filename: file.name, base64 });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    const parsed = parsePhoneNumber(data.phone);
    const result = await submitCareerApplication({
      page_name: "CAREER",
      page_url: "/career",
      full_name: data.fullName,
      email: data.email,
      phone_country_code: parsed ? `+${parsed.countryCallingCode}` : "",
      phone_number: parsed?.nationalNumber ?? data.phone,
      current_location: data.currentLocation,
      applying_for: data.applyingFor,
      experience: data.experience,
      linkedin_url: data.linkedinUrl ?? "",
      message: data.message,
      ...(resumeFile && {
        resume_filename: resumeFile.filename,
        resume_base64: resumeFile.base64,
      }),
    });

    if (result.success) setIsSuccess(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
  };

  return (
    <div className={`rounded-lg ${className}`}>
      <h2 className="mb-8 text-center font-heading text-h2 font-light text-primary">
        {title}
      </h2>

      {isSuccess ? (
        <SuccessState />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {/* Row 1: Full Name | Email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField error={errors.fullName?.message}>
              <FormInput placeholder="First Name" hasError={!!errors.fullName} {...register("fullName")} />
            </FormField>
            <FormField error={errors.email?.message}>
              <FormInput type="email" placeholder="Email" hasError={!!errors.email} {...register("email")} />
            </FormField>
          </div>

          {/* Row 2: Phone | Current Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField error={errors.phone?.message}>
              <Controller
                name="phone"
                control={control as Control<FormValues>}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    onChange={(val) => { if (!val || val.length <= 16) field.onChange(val); }}
                    defaultCountry="IN"
                    international
                    placeholder="Phone Number"
                    maxLength={20}
                    className={`connect-phone-input${!field.value ? " connect-phone-input--empty" : ""}${errors.phone ? " connect-phone-input--error" : ""}`}
                  />
                )}
              />
            </FormField>
            <FormField error={errors.currentLocation?.message}>
              <FormInput placeholder="Current Location" hasError={!!errors.currentLocation} {...register("currentLocation")} />
            </FormField>
          </div>

          {/* Row 3: Applying For | Experience */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField error={errors.applyingFor?.message}>
              <FormSelect hasError={!!errors.applyingFor} {...register("applyingFor")}>
                <option value="" disabled>Applying For</option>
                {APPLYING_FOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </FormSelect>
            </FormField>
            <FormField error={errors.experience?.message}>
              <FormInput placeholder="Experience" hasError={!!errors.experience} {...register("experience")} />
            </FormField>
          </div>

          {/* Row 4: LinkedIn URL | Attach Resume */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField error={undefined}>
              <FormInput placeholder="LinkedIn URL" {...register("linkedinUrl")} />
            </FormField>
            <FormField error={fileError}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex min-h-[52px] w-full items-center justify-between rounded-lg bg-surface px-4 py-3 text-left text-body text-secondary/60 outline-none transition-colors hover:ring-1 hover:ring-primary/30 focus:ring-1 focus:ring-primary/30 ${fileError ? "ring-1 ring-red-500" : ""}`}
              >
                <span className={resumeFile ? "text-primary" : ""}>
                  {resumeFile ? resumeFile.filename : "Attach Resume"}
                </span>
                <Image
                  src="/images/icons/attach-resume.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </FormField>
          </div>

          {/* Row 5: Message */}
          <FormField error={errors.message?.message}>
            <FormTextarea placeholder="Why Torque Pharma?" rows={5} hasError={!!errors.message} {...register("message")} />
          </FormField>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
          )}

          {/* Submit row */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-[600px] text-h5 font-normal leading-6 text-secondary">{disclaimer}</p>
            <SplitButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="shrink-0"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </SplitButton>
          </div>
        </form>
      )}
    </div>
  );
}

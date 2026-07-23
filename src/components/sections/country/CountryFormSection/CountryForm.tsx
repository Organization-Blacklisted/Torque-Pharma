"use client";

import { useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber, type Country } from "react-phone-number-input/min";
import parsePhoneNumber from "libphonenumber-js/min";
import "react-phone-number-input/style.css";
import { FormField, FormInput, FormTextarea } from "@/components/ui/Form";
import { SplitButton } from "@/components/ui/SplitButton";
import { submitCountryEnquiry } from "@/lib/actions/country-enquiry";
import { navItems } from "@/data/nav.config";

// Therapeutic areas come from the International nav (export categories).
const productsNav = navItems.find((item) => "mega" in item && item.mega);
const internationalAreas =
  productsNav && "mega" in productsNav && productsNav.mega
    ? (productsNav.mega.find((p) => p.slug === "export")?.areas ?? [])
    : [];

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  firstName:       z.string().min(1, "First name is required").max(50),
  lastName:        z.string().min(1, "Last name is required").max(50),
  email:           z.string().min(1, "Email is required").refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"),
  phone:           z.string().min(1, "Phone number is required").refine((v) => isValidPhoneNumber(v), "Enter a valid phone number"),
  company:         z.string().max(100).optional(),
  therapeuticArea: z.string().min(1, "Please select a therapeutic area"),
  message:         z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Select ───────────────────────────────────────────────────────────────────

function FormSelect({
  hasError,
  onChange,
  className = "",
  children,
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
        className={`w-full min-h-[52px] appearance-none rounded-lg bg-surface px-4 py-3 text-body outline-none transition-colors focus:ring-1 focus:ring-primary/30 ${
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

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint">
        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-heading text-h3 text-primary">Enquiry Submitted</h3>
      <p className="text-body text-secondary">Thank you for reaching out. Our team will get back to you shortly.</p>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface CountryFormProps {
  pageName: string;
  pageUrl: string;
  /** ISO 3166-1 alpha-2 code to pre-select in the phone field (editable). */
  defaultCountry?: string;
}

export default function CountryForm({ pageName, pageUrl, defaultCountry = "IN" }: CountryFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      company: "", therapeuticArea: "", message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    const parsed = parsePhoneNumber(data.phone);
    const result = await submitCountryEnquiry({
      page_name: pageName,
      page_url: pageUrl,
      first_name: data.firstName,
      last_name: data.lastName,
      phone_country_code: parsed ? `+${parsed.countryCallingCode}` : "",
      phone_number: parsed?.nationalNumber ?? data.phone,
      email: data.email,
      company_name: data.company ?? "",
      therapeutic_area: data.therapeuticArea,
      message: data.message ?? "",
    });
    if (result.success) setIsSuccess(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
  };

  if (isSuccess) return <SuccessState />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.firstName?.message}>
          <FormInput placeholder="First Name" hasError={!!errors.firstName} {...register("firstName")} />
        </FormField>
        <FormField error={errors.lastName?.message}>
          <FormInput placeholder="Last Name" hasError={!!errors.lastName} {...register("lastName")} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.email?.message}>
          <FormInput type="email" placeholder="Email" hasError={!!errors.email} {...register("email")} />
        </FormField>
        <FormField error={errors.phone?.message}>
          <Controller
            name="phone"
            control={control as Control<FormValues>}
            render={({ field }) => (
              <PhoneInput
                {...field}
                onChange={(val) => { if (!val || val.length <= 16) field.onChange(val); }}
                defaultCountry={defaultCountry as Country}
                international
                numberInputProps={{ "aria-label": "Phone number" }}
                placeholder="Phone Number"
                maxLength={20}
                className={`connect-phone-input${!field.value ? " connect-phone-input--empty" : ""}${errors.phone ? " connect-phone-input--error" : ""}`}
              />
            )}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.company?.message}>
          <FormInput placeholder="Company (If Applicable)" hasError={!!errors.company} {...register("company")} />
        </FormField>
        <FormField error={errors.therapeuticArea?.message}>
          <FormSelect aria-label="Therapeutic Area" hasError={!!errors.therapeuticArea} {...register("therapeuticArea")}>
            <option value="" disabled>Therapeutic Area</option>
            {internationalAreas.map((area) => (
              <option key={area.label} value={area.label}>{area.label}</option>
            ))}
          </FormSelect>
        </FormField>
      </div>

      <FormField error={errors.message?.message}>
        <FormTextarea placeholder="Message" rows={5} hasError={!!errors.message} {...register("message")} />
      </FormField>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <SplitButton
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-full"
        labelClassName="flex-1 justify-center"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </SplitButton>
    </form>
  );
}

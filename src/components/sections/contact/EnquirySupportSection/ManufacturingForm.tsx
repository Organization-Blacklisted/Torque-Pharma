"use client";

import { useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input/min";
import parsePhoneNumber from "libphonenumber-js/min";
import "react-phone-number-input/style.css";
import { FormField, FormInput, FormTextarea } from "@/components/ui/Form";
import { SplitButton } from "@/components/ui/SplitButton";
import { submitManufacturingEnquiry } from "@/lib/actions/manufacturing-enquiry";

// ─── Dropdown options ─────────────────────────────────────────────────────────

const PRODUCT_TYPES = [
  "Pharmaceutical Products",
  "Dermatology Products",
  "Personal Care Products",
  "Ayurvedic Products",
  "Nutraceutical Products",
  "OTC Products",
  "Other",
] as const;

const QUANTITY_OPTIONS = [
  "Below 10,000 Units",
  "10,000–50,000 Units",
  "50,001–100,000 Units",
  "100,001–500,000 Units",
  "Above 500,000 Units",
  "To Be Discussed",
] as const;

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  fullName:    z.string().min(1, "Full name is required").max(100).refine((v) => /^[a-zA-Z\s]+$/.test(v.trim()), "Full name must contain only letters"),
  companyName: z.string().min(1, "Company name is required").max(100),
  email:       z.string().min(1, "Email is required").refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"),
  phone:       z.string().min(1, "Phone number is required").max(16).refine((v) => isValidPhoneNumber(v), "Enter a valid phone number"),
  state:       z.string().min(1, "State is required").max(100),
  productType: z.string().min(1, "Please select a product type"),
  quantity:    z.string().min(1, "Please select a quantity"),
  message:     z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

// ─── Select wrapper ───────────────────────────────────────────────────────────

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
      {/* Chevron */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-secondary">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
      <p className="text-body text-secondary">Thank you for your manufacturing enquiry. Our team will review your requirements and get back to you shortly.</p>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export default function ManufacturingForm() {
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
      fullName: "", companyName: "", email: "", phone: "",
      state: "", productType: "", quantity: "", message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    const parsed = parsePhoneNumber(data.phone);
    const result = await submitManufacturingEnquiry({
      page_name: "Contact Us",
      page_url: "/contact-us",
      full_name: data.fullName,
      company_name: data.companyName,
      email: data.email,
      phone_country_code: parsed ? `+${parsed.countryCallingCode}` : "",
      phone_number: parsed?.nationalNumber ?? data.phone,
      state: data.state,
      product_type: data.productType,
      quantity: data.quantity,
      message: data.message,
    });
    if (result.success) setIsSuccess(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
  };

  if (isSuccess) return <SuccessState />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {/* Row 1: Full Name + Company Name */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.fullName?.message}>
          <FormInput placeholder="Full Name" hasError={!!errors.fullName} {...register("fullName")} />
        </FormField>
        <FormField error={errors.companyName?.message}>
          <FormInput placeholder="Company Name" hasError={!!errors.companyName} {...register("companyName")} />
        </FormField>
      </div>

      {/* Row 2: Email + Phone */}
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
                defaultCountry="IN"
                international
                placeholder="Phone Number"
                maxLength={20}
                className={`connect-phone-input${!field.value ? " connect-phone-input--empty" : ""}${errors.phone ? " connect-phone-input--error" : ""}`}
              />
            )}
          />
        </FormField>
      </div>

      {/* Row 3: State + Product Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.state?.message}>
          <FormInput placeholder="Select State" hasError={!!errors.state} {...register("state")} />
        </FormField>
        <FormField error={errors.productType?.message}>
          <FormSelect hasError={!!errors.productType} {...register("productType")}>
            <option value="" disabled>Product Type</option>
            {PRODUCT_TYPES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </FormSelect>
        </FormField>
      </div>

      {/* Row 4: Quantity */}
      <FormField error={errors.quantity?.message}>
        <FormSelect hasError={!!errors.quantity} {...register("quantity")}>
          <option value="" disabled>Choose Quantity</option>
          {QUANTITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </FormSelect>
      </FormField>

      {/* Row 5: Message */}
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
        {isSubmitting ? "Sending..." : "Request a Quote"}
      </SplitButton>
    </form>
  );
}

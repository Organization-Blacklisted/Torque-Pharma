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
import { submitThirdPartyManufacturingEnquiry } from "@/lib/actions/third-party-manufacturing";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less")
    .refine((v) => /^[a-zA-Z\s]+$/.test(v.trim()), "Full name must contain only letters"),
  companyName: z.string().min(1, "Company / brand name is required").max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(16, "Phone number is too long")
    .refine((v) => isValidPhoneNumber(v), "Enter a valid phone number"),
  requirement: z.string().min(1, "Manufacturing requirement is required"),
  productDetails: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

// ─── Success state (dark variant, matching the dark form card) ────────────────

function SuccessState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint">
        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="font-heading text-h3 text-white">Request Submitted</h3>
      <p className="text-body text-white/70">Thank you for reaching out. Our team will review your requirements and get back to you shortly.</p>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface ThirdPartyManufacturingFormProps {
  title: string;
  subtitle: string;
  pageName: string;
  pageUrl: string;
  submitLabel: string;
}

export default function ThirdPartyManufacturingForm({
  title,
  subtitle,
  pageName,
  pageUrl,
  submitLabel,
}: ThirdPartyManufacturingFormProps) {
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
      requirement: "", productDetails: "", message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    const parsed = parsePhoneNumber(data.phone);
    const result = await submitThirdPartyManufacturingEnquiry({
      page_name: pageName,
      page_url: pageUrl,
      full_name: data.fullName,
      company_name: data.companyName,
      email: data.email,
      phone_country_code: parsed ? `+${parsed.countryCallingCode}` : "",
      phone_number: parsed?.nationalNumber ?? data.phone,
      manufacturing_requirement: data.requirement,
      product_details: data.productDetails ?? "",
      message: data.message,
    });
    if (result.success) setIsSuccess(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
  };

  if (isSuccess) return <SuccessState />;

  return (
    <>
      <h2 className="font-body text-h4 font-medium text-white">{title}</h2>
      <p className="mt-2 text-body text-white/80">{subtitle}</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField error={errors.fullName?.message}>
            <FormInput placeholder="Full Name" hasError={!!errors.fullName} className="!bg-white" {...register("fullName")} />
          </FormField>
          <FormField error={errors.companyName?.message}>
            <FormInput placeholder="Company / Brand Name" hasError={!!errors.companyName} className="!bg-white" {...register("companyName")} />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField error={errors.email?.message}>
            <FormInput type="email" placeholder="Business Email" hasError={!!errors.email} className="!bg-white" {...register("email")} />
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
                  numberInputProps={{ "aria-label": "Phone Number" }}
                  placeholder="Phone Number"
                  maxLength={20}
                  className={`connect-phone-input connect-phone-input--white${!field.value ? " connect-phone-input--empty" : ""}${errors.phone ? " connect-phone-input--error" : ""}`}
                />
              )}
            />
          </FormField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField error={errors.requirement?.message}>
            <FormInput placeholder="Manufacturing Requirement" hasError={!!errors.requirement} className="!bg-white" {...register("requirement")} />
          </FormField>
          <FormField error={errors.productDetails?.message}>
            <FormInput placeholder="Product Details" hasError={!!errors.productDetails} className="!bg-white" {...register("productDetails")} />
          </FormField>
        </div>

        <FormField error={errors.message?.message}>
          <FormTextarea placeholder="Message" rows={5} hasError={!!errors.message} className="!bg-white" {...register("message")} />
        </FormField>

        {serverError && (
          <p className="rounded-lg bg-red-900/40 px-4 py-3 text-sm text-red-300">{serverError}</p>
        )}

        <SplitButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full"
          labelClassName="flex-1 justify-center"
        >
          {isSubmitting ? "Sending..." : submitLabel}
        </SplitButton>
      </form>
    </>
  );
}

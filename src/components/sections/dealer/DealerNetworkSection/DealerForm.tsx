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
import { submitDealerContactForm } from "@/lib/actions/dealer-contact";

const schema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be 100 characters or less"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(16, "Phone number is too long")
    .refine((v) => isValidPhoneNumber(v), "Enter a valid phone number"),
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be 100 characters or less"),
  businessEmail: z
    .string()
    .min(1, "Email is required")
    .refine(
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Enter a valid email address",
    ),
  gstNumber: z.string().min(1, "GST number is required").max(100, ""),
  state: z.string().min(1, "State is required").max(100, ""),
  cityDistrict: z.string().min(1, "City / District is required").max(100, ""),
  drugLicNumber: z.string().min(1, "Drug license number is required").max(100, ""),
  monthlyVolume: z.string().min(1, "Monthly dealer volume is required"),
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof schema>;

export default function DealerForm() {
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
      fullName: "",
      phone: "",
      businessName: "",
      businessEmail: "",
      gstNumber: "",
      state: "",
      cityDistrict: "",
      drugLicNumber: "",
      monthlyVolume: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");
    const parsed = parsePhoneNumber(data.phone);
    const result = await submitDealerContactForm({
      page_name: "Become a Dealer",
      page_url: "/become-a-dealer",
      full_name: data.fullName,
      phone_country_code: parsed ? `+${parsed.countryCallingCode}` : "",
      phone_number: parsed?.nationalNumber ?? data.phone,
      business_name: data.businessName,
      business_email: data.businessEmail,
      gst_number: data.gstNumber,
      state: data.state,
      city_district: data.cityDistrict,
      drug_lic_number: data.drugLicNumber,
      monthly_volume: data.monthlyVolume,
      message: data.message,
    });
    if (result.success) setIsSuccess(true);
    else setServerError(result.error ?? "Something went wrong. Please try again.");
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
        <h3 className="font-heading text-h3 text-white">Dealer Enquiry Received</h3>
        <p className="text-body text-white/70">
         Thank you for your interest in becoming a Torque Pharma dealer. Our team will review your details and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.fullName?.message}>
          <FormInput
            placeholder="Full Name"
            hasError={!!errors.fullName}
            className="!bg-white"
            {...register("fullName")}
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
                numberInputProps={{ "aria-label": "Phone number" }}
                maxLength={20}
                className={`connect-phone-input connect-phone-input--white${errors.phone ? " connect-phone-input--error" : ""}`}
              />
            )}
          />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.businessName?.message}>
          <FormInput
            placeholder="Business Name"
            hasError={!!errors.businessName}
            className="!bg-white"
            {...register("businessName")}
          />
        </FormField>
        <FormField error={errors.businessEmail?.message}>
          <FormInput
            type="email"
            placeholder="Business Email"
            hasError={!!errors.businessEmail}
            className="!bg-white"
            {...register("businessEmail")}
          />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.gstNumber?.message}>
          <FormInput
            placeholder="GST Number"
            hasError={!!errors.gstNumber}
            className="!bg-white"
            {...register("gstNumber")}
          />
        </FormField>
        <FormField error={errors.state?.message}>
          <FormInput
            placeholder="State"
            hasError={!!errors.state}
            className="!bg-white"
            {...register("state")}
          />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField error={errors.cityDistrict?.message}>
          <FormInput
            placeholder="City / District"
            hasError={!!errors.cityDistrict}
            className="!bg-white"
            {...register("cityDistrict")}
          />
        </FormField>
        <FormField error={errors.drugLicNumber?.message}>
          <FormInput
            placeholder="Drug License Number"
            hasError={!!errors.drugLicNumber}
            className="!bg-white"
            {...register("drugLicNumber")}
          />
        </FormField>
      </div>
      <FormField error={errors.monthlyVolume?.message}>
        <FormInput
          placeholder="Monthly Dealer Volume"
          hasError={!!errors.monthlyVolume}
          className="!bg-white"
          {...register("monthlyVolume")}
        />
      </FormField>
      <FormField error={errors.message?.message}>
        <FormTextarea
          placeholder="Message"
          rows={5}
          hasError={!!errors.message}
          className="!bg-white"
          {...register("message")}
        />
      </FormField>
      {serverError && (
        <p className="rounded-lg bg-red-900/40 px-4 py-3 text-sm text-red-300">
          {serverError}
        </p>
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

"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input/min";
import "react-phone-number-input/style.css";
import { FormField, FormInput, FormTextarea } from "@/components/ui/Form";
import { SplitButton } from "@/components/ui/SplitButton";
import { navItems } from "@/data/nav.config";

const productsNav = navItems.find((item) => "mega" in item && item.mega);
const internationalAreas =
  productsNav && "mega" in productsNav && productsNav.mega
    ? (productsNav.mega.find((p) => p.slug === "export")?.areas ?? [])
    : [];

function FormSelect({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [hasValue, setHasValue] = useState(false);
  return (
    <div className="relative">
      <select
        onChange={(e) => {
          setHasValue(!!e.target.value);
          props.onChange?.(e);
        }}
        className={`w-full min-h-[52px] appearance-none rounded-lg bg-surface px-4 py-3 text-body outline-none transition-colors focus:ring-1 focus:ring-primary/30 ${
          hasValue ? "text-primary" : "text-secondary/60"
        }`}
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

export default function CountryForm() {
  const [phone, setPhone] = useState<string | undefined>("");

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <FormInput placeholder="First Name" name="firstName" />
        </FormField>
        <FormField>
          <FormInput placeholder="Last Name" name="lastName" />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <FormInput type="email" placeholder="Email" name="email" />
        </FormField>
        <FormField>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            defaultCountry="IN"
            international
            placeholder="Phone Number"
            maxLength={20}
            className={`connect-phone-input${!phone ? " connect-phone-input--empty" : ""}`}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField>
          <FormInput placeholder="Company (If Applicable)" name="company" />
        </FormField>
        <FormField>
          <FormSelect name="therapeuticArea" defaultValue="">
            <option value="" disabled>Therapeutic Area</option>
            {internationalAreas.map((area) => (
              <option key={area.label} value={area.label}>{area.label}</option>
            ))}
          </FormSelect>
        </FormField>
      </div>

      <FormField>
        <FormTextarea placeholder="Message" rows={5} name="message" />
      </FormField>

      <SplitButton
        type="submit"
        variant="primary"
        className="w-full"
        labelClassName="flex-1 justify-center"
      >
        Submit
      </SplitButton>
    </form>
  );
}

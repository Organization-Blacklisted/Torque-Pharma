export interface ContractManufacturingItem {
  icon: string;
  title: string;
  description: string;
}

export interface ContractManufacturingData {
  eyebrow: string;
  heading: string;
  description: string;
  items: ContractManufacturingItem[];
  cta: {
    label: string;
    href: string;
  };
}

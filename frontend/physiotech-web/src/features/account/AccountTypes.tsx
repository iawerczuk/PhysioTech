export type Tab = "wypozyczenie" | "dane" | "historia";

export type BillingForm = {
  address: string;
  city: string;
  postalCode: string;
  needInvoice: boolean;
  companyName: string;
  nip: string;
};

export type BillingErrors = Partial<Record<keyof BillingForm, string>>;

export const EMPTY_BILLING: BillingForm = {
  address: "",
  city: "",
  postalCode: "",
  needInvoice: false,
  companyName: "",
  nip: "",
};
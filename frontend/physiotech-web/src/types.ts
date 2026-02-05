export type Device = {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  availableQuantity: number;
  imageUrl?: string | null;
  isActive: boolean;
};

export type Step = {
  title: string;
  desc: string;
  details: string[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type DeviceCategory =
  | "Elektrostymulacja"
  | "Wsparcie chodzenia"
  | "Kompresjoterapia"
  | "Terapia zimnem";
export type RentalDevice = {
  deviceId: number;
  deviceName: string;
  quantity: number;
  pricePerDay: number;
  deposit: number;
};

export type MyRental = {
  id: number;
  startDate: string;
  endDate: string;
  status?: string | null;
  createdAt?: string | null;
  days?: number;
  items?: { deviceId: number; deviceName: string; quantity: number }[];
};
export type Cart = {
  deviceId: number;
  name: string;
  quantity: number;
  pricePerDay: number;
  deposit: number;

  startDate?: string; 
  endDate?: string;  
  
};

export type RentalDetailsDto = {
  id: number;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  createdAt?: string | null;
  items: {
    deviceId: number;
    deviceName: string;
    quantity: number;
    pricePerDay: number;
    deposit: number;
    itemDays: number;
    totalRental: number;
    totalDeposit: number;
  }[];
};
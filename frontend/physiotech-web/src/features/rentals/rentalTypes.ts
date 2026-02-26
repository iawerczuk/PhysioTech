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
  devices: RentalDevice[];
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
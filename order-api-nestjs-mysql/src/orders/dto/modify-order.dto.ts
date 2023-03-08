export class ModifyOrderDto {
  id?: number;
  createdDate: string;
  deliveryId: number;
  pickupId: number;
  productTotal: number;
  transport: number;
  licensePlates: string; 
  driver: string;
  receivedDate: string;
  note: string;
  status: number;
  contract: string;
  products: ProductItem[];
  selectedDelivery?: string;
  selectedPickup?: string;
  selectedTransport?: string;
  statusLabel?: string;
  updatedDate?: string;
  agencyId?: number;
  agencyName?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  quantity: number;
}
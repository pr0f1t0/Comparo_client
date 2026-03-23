export type AvailabilityStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER' | 'DISCONTINUED';

export interface OfferResponse {
  id: string;
  productId: string;
  shopId: string;
  price: number;
  currency: string;
  url: string;
  availabilityStatus: AvailabilityStatus;
  lastUpdated: string;
}

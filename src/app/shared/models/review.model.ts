export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ReviewResponse {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  status: ModerationStatus;
  createdAt: string;
}

export interface ReviewCreateRequest {
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewUpdateRequest {
  rating: number;
  comment: string;
}

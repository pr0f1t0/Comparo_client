export interface StatsResponse {
  statDate: string;
  totalUsers: number;
  totalProducts: number;
  pendingReviews: number;
}

export interface AdminUserResponse {
  id: string;
  email: string;
  firstName: string;
  enabled: boolean;
}

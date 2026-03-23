export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserUpdateRequest {
  firstName: string;
  lastName: string;
}

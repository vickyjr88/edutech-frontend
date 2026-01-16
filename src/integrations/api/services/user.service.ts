// src/integrations/api/services/user.service.ts
import { api, ApiResponse } from '../client';

export interface UpdateUserDto {
  fullName?: string;
  phoneNumber?: string;
  alternativePhoneNumber?: string;
  bio?: string;
}

export const userService = {
  /**
   * Update user profile
   */
  updateUser: (userId: string, data: UpdateUserDto): Promise<ApiResponse<any>> => {
    return api.patch<any>(`/users/${userId}`, data);
  },
};

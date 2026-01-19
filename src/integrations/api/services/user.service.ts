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

  /**
   * Add class to wishlist
   */
  addToWishlist: (classId: string): Promise<ApiResponse<any>> => {
    return api.post<any>(`/users/wishlist/${classId}`, {});
  },

  /**
   * Remove class from wishlist
   */
  removeFromWishlist: (classId: string): Promise<ApiResponse<any>> => {
    return api.delete<any>(`/users/wishlist/${classId}`);
  },
};

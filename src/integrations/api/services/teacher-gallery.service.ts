import { api } from '../client';

export interface GalleryPhoto {
  url: string;
  title: string;
  description?: string;
}

export const teacherGalleryService = {
  addPhoto: (teacherId: string, photo: GalleryPhoto) =>
    api.post(`/teachers/${teacherId}/gallery`, photo),

  getPhotos: (teacherId: string) =>
    api.get<GalleryPhoto[]>(`/teachers/${teacherId}/gallery`),

  deletePhoto: (teacherId: string, photoIndex: number) =>
    api.delete(`/teachers/${teacherId}/gallery/${photoIndex}`),
};

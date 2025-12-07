import { api } from '../client';

export interface Video {
  url: string;
  title: string;
  description: string;
}

export const teacherVideosService = {
  addVideo: (teacherId: string, video: Video) =>
    api.post(`/teachers/${teacherId}/videos`, video),

  getVideos: (teacherId: string) =>
    api.get<Video[]>(`/teachers/${teacherId}/videos`),

  deleteVideo: (teacherId: string, videoIndex: number) =>
    api.delete(`/teachers/${teacherId}/videos/${videoIndex}`),
};

import { api } from '../client';

export interface Resource {
  title: string;
  description: string;
  type: string;
  downloadUrl: string;
}

export interface Article {
  title: string;
  description: string;
  date: string;
  readUrl: string;
}

export interface SuccessStory {
  category: string; // e.g., "Recent Win", "Parent Feedback", "Long-term Impact"
  content: string;
  date?: string;
}

export const teacherResourcesService = {
  addResource: (teacherId: string, resource: Resource) =>
    api.post(`/teachers/${teacherId}/resources`, resource),

  getResources: (teacherId: string) =>
    api.get<Resource[]>(`/teachers/${teacherId}/resources`),

  deleteResource: (teacherId: string, resourceIndex: number) =>
    api.delete(`/teachers/${teacherId}/resources/${resourceIndex}`),

  addArticle: (teacherId: string, article: Article) =>
    api.post(`/teachers/${teacherId}/articles`, article),

  getArticles: (teacherId: string) =>
    api.get<Article[]>(`/teachers/${teacherId}/articles`),

  deleteArticle: (teacherId: string, articleIndex: number) =>
    api.delete(`/teachers/${teacherId}/articles/${articleIndex}`),

  addSuccessStory: (teacherId: string, story: SuccessStory) =>
    api.post(`/teachers/${teacherId}/success-stories`, story),

  getSuccessStories: (teacherId: string) =>
    api.get<SuccessStory[]>(`/teachers/${teacherId}/success-stories`),

  deleteSuccessStory: (teacherId: string, storyIndex: number) =>
    api.delete(`/teachers/${teacherId}/success-stories/${storyIndex}`),
};

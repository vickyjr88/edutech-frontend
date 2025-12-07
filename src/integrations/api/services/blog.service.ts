import { api, ApiResponse } from '../client';

export interface CommentAuthor {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
}

export interface BlogComment {
    _id: string;
    id?: string;
    postId: string;
    author: CommentAuthor;
    content: string;
    status: string;
    parentId?: string;
    replies: BlogComment[];
    likes: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogCommentDto {
    postId: string;
    author: CommentAuthor;
    content: string;
    parentId?: string;
}

export const blogService = {
    getComments: (postId: string, status?: string): Promise<ApiResponse<BlogComment[]>> => {
        return api.get<BlogComment[]>(`/blog/posts/${postId}/comments`, { params: { status } });
    },

    createComment: (data: CreateBlogCommentDto): Promise<ApiResponse<BlogComment>> => {
        return api.post<BlogComment>('/blog/comments', data);
    }
};

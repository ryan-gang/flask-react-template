import APIService from 'frontend/services/api.service';
import {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentListResponse,
  ApiResponse,
} from 'frontend/types';
import { getAccessTokenFromStorage } from 'frontend/utils/storage-util';

export default class CommentService extends APIService {
  getComments = async (
    accountId: string,
    taskId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<ApiResponse<CommentListResponse>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.get(
      `/accounts/${accountId}/tasks/${taskId}/comments`,
      {
        params: { page, size: perPage },
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );

    // Transform PaginationResult to CommentListResponse
    const paginationResult = response.data;
    const commentListResponse = {
      comments: paginationResult.items || [],
      total: paginationResult.total_count || 0,
      page: paginationResult.pagination_params?.page || 1,
      per_page: paginationResult.pagination_params?.size || 10,
      total_pages: paginationResult.total_pages || 0,
    };

    return new ApiResponse(commentListResponse);
  };

  createComment = async (
    accountId: string,
    taskId: string,
    commentData: CreateCommentRequest,
  ): Promise<ApiResponse<Comment>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.post(
      `/accounts/${accountId}/tasks/${taskId}/comments`,
      commentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );
    return new ApiResponse(response.data);
  };

  updateComment = async (
    accountId: string,
    taskId: string,
    commentId: string,
    commentData: UpdateCommentRequest,
  ): Promise<ApiResponse<Comment>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.patch(
      `/accounts/${accountId}/tasks/${taskId}/comments/${commentId}`,
      commentData,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );
    return new ApiResponse(response.data);
  };

  deleteComment = async (
    accountId: string,
    taskId: string,
    commentId: string,
  ): Promise<ApiResponse<void>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    await this.apiClient.delete(
      `/accounts/${accountId}/tasks/${taskId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );
    return new ApiResponse(undefined);
  };

  getComment = async (
    accountId: string,
    taskId: string,
    commentId: string,
  ): Promise<ApiResponse<Comment>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.get(
      `/accounts/${accountId}/tasks/${taskId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );
    return new ApiResponse(response.data);
  };
}

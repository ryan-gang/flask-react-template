import APIService from 'frontend/services/api.service';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskListResponse,
  ApiResponse,
} from 'frontend/types';
import { getAccessTokenFromStorage } from 'frontend/utils/storage-util';

export default class TaskService extends APIService {
  getTasks = async (
    accountId: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<ApiResponse<TaskListResponse>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.get(`/accounts/${accountId}/tasks`, {
      params: { page, size: perPage },
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });

    // Transform PaginationResult to TaskListResponse
    const paginationResult = response.data;
    const taskListResponse = {
      tasks: paginationResult.items || [],
      total: paginationResult.total_count || 0,
      page: paginationResult.pagination_params?.page || 1,
      per_page: paginationResult.pagination_params?.size || 10,
      total_pages: paginationResult.total_pages || 0,
    };

    return new ApiResponse(taskListResponse);
  };

  createTask = async (
    accountId: string,
    taskData: CreateTaskRequest,
  ): Promise<ApiResponse<Task>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.post(
      `/accounts/${accountId}/tasks`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );
    return new ApiResponse(response.data);
  };

  updateTask = async (
    accountId: string,
    taskId: string,
    taskData: UpdateTaskRequest,
  ): Promise<ApiResponse<Task>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.patch(
      `/accounts/${accountId}/tasks/${taskId}`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );
    return new ApiResponse(response.data);
  };

  deleteTask = async (
    accountId: string,
    taskId: string,
  ): Promise<ApiResponse<void>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    await this.apiClient.delete(`/accounts/${accountId}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    });
    return new ApiResponse(undefined);
  };

  getTask = async (
    accountId: string,
    taskId: string,
  ): Promise<ApiResponse<Task>> => {
    const accessToken = getAccessTokenFromStorage();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await this.apiClient.get(
      `/accounts/${accountId}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    );
    return new ApiResponse(response.data);
  };
}

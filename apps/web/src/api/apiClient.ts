import { ApiResponse, GenericError } from '@wl-apps/types';
import { getAuthHeader } from '@utils/auth';
import { ApiError, AuthenticationError, NetworkError, NotFoundError, ValidationError } from './errors';

export class ApiClient {
  private static async handleResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    try {
      const data = await response.json() as ApiResponse<T>;

      const errorData = data as unknown as ApiResponse<GenericError>;
      const errorMessage = (errorData.data as GenericError)?.message || response.statusText;

      const errorResponse: ApiResponse<GenericError> = {
        data: {
          message: errorMessage,
          code: (errorData.data as GenericError)?.code,
          stack: (errorData.data as GenericError)?.stack
        },
        success: false
      };
      
      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new AuthenticationError(errorMessage || 'Authentication failed');
          case 404:
            throw new NotFoundError(errorMessage || 'Resource not found');
          case 400:
            throw new ValidationError(errorMessage || 'Validation failed');
          default:
            throw new ApiError(
              errorMessage || `Server error: ${response.statusText}`,
              response.status,
              errorResponse
            );
        }
      }

      if (!data.success) {
        throw new ApiError(
          errorMessage || 'Operation failed',
          response.status,
          errorResponse
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError('Failed to process response');
    }
  }

  static async get<T>(
    url: string,
    params?: Record<string, string>
  ): Promise<T> {
    try {
      const queryString = params ? `?${new URLSearchParams(params)}` : '';
      const response = await fetch(`${url}${queryString}`, {
        headers: getAuthHeader()
      });

      const result = await this.handleResponse<T>(response);
      return result.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError('Failed to fetch data');
    }
  }

  static async post<T>(url: string, data: unknown, insecure?: boolean): Promise<T> {
    try {
      const headers = insecure
        ? { 'Content-Type': 'application/json' }
        : {
            ...getAuthHeader(),
            'Content-Type': 'application/json'
          };
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
      
      const result = await this.handleResponse<T>(response);
      return result.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError('Failed to complete operation');
    }
  }

  static async put<T>(url: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await this.handleResponse<T>(response);
      return result.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError('Failed to update data');
    }
  }

  static async delete(url: string): Promise<void> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      await this.handleResponse<void>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError('Failed to delete data');
    }
  }
}

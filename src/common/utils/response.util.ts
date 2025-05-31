import { Response } from 'express';
import { ApiResponse } from '../responses/api.response';

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
  errors: string[] | null = null,
) {
  const response = new ApiResponse(statusCode, message, data, errors);
  return res.status(statusCode).json(response);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: unknown }).response;

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const message = (response as { message?: unknown }).message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }
  }

  return 'unknown error';
}

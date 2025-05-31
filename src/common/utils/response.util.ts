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
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'unknown error';
}

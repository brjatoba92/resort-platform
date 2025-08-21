import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseHandler {
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(message && { message })
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, error: string, statusCode: number = 400) {
    const response: ApiResponse = {
      success: false,
      error
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string) {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
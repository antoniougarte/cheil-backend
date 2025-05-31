export class ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
  errors: any[] | null;

  constructor(
    status: number,
    message: string,
    data: T | null = null,
    errors: any[] | null = null,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

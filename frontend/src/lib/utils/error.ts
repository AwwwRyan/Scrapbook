import { toast } from 'react-hot-toast';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
  console.error(error);
}; 
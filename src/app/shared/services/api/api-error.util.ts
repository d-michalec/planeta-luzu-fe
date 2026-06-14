import { HttpErrorResponse } from '@angular/common/http';

export function resolveApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;

    if (typeof body?.message === 'string' && body.message.trim()) {
      return body.message;
    }

    if (typeof body?.error === 'string' && body.error.trim()) {
      return body.error;
    }

    if (typeof body === 'string' && body.trim()) {
      return body;
    }
  }

  return fallback;
}

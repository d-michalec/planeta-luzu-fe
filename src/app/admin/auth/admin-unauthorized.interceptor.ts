import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

export const adminUnauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AdminAuthService);

  return next(req).pipe(
    catchError(error => {
      const isAdminRequest = req.url.includes('/auth/admin');
      const isLoginRequest = req.url.includes('/auth/admin/login');

      if (error instanceof HttpErrorResponse && error.status === 401 && isAdminRequest && !isLoginRequest) {
        auth.clearSession();
        router.navigate(['/admin/login']);
      }

      return throwError(() => error);
    })
  );
};

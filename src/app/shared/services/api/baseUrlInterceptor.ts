import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiUrl;

  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedUrl = req.url.replace(/^\/+/, '');

  const apiReq = req.clone({
    url: `${normalizedBase}/${normalizedUrl}`,
  });

  return next(apiReq);
};

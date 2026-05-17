import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export type OPTIONS = {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
  reportProgress?: boolean;
  responseType: 'json';
  withCredentials?: boolean;
  keepalive?: boolean;
  transferCache?: { includeHeaders?: string[] } | boolean;
};

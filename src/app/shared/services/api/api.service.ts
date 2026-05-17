import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OPTIONS } from './models/http-options.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly BASE_URL = environment.apiUrl;
  private readonly http = inject(HttpClient);

  public get<T>(url: string, options?: OPTIONS): Observable<T> {
    return this.http.get<T>(url, options);
  }

  public download(url: string): Observable<HttpResponse<Blob>> {
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  public post<T>(url: string, body?: unknown, options?: OPTIONS): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  public put<T>(url: string, body: unknown, options?: OPTIONS): Observable<T> {
    return this.http.put<T>(url, body, options);
  }

  public delete<T>(url: string, options?: OPTIONS): Observable<T> {
    return this.http.delete<T>(url, options);
  }
}

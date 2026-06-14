import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '../../shared/services/api/api.service';
import { AdminLoginRequest, AdminSession } from './admin-auth.model';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private api = inject(ApiService);

  readonly session = signal<AdminSession | null>(null);

  login(request: AdminLoginRequest): Observable<AdminSession> {
    return this.api.post<AdminSession>('/auth/admin/login', request).pipe(
      tap(session => this.session.set(session))
    );
  }

  me(): Observable<AdminSession> {
    return this.api.get<AdminSession>('/auth/admin/me').pipe(
      tap(session => this.session.set(session))
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>('/auth/admin/logout', {}).pipe(
      tap(() => this.session.set(null))
    );
  }

  clearSession() {
    this.session.set(null);
  }
}

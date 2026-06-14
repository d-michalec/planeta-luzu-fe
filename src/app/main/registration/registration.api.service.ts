import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api/api.service';
import { RegisterRequest, RegisterResponse } from './registration.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationApiService {
  private readonly api = inject(ApiService);

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.api.post<RegisterResponse>('auth/register', request);
  }
}

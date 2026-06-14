import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { AdminRegisterRequest, RegisteredUsersDto } from '../shared/model/registered-users.model';

@Injectable({
  providedIn: 'root',
})
export class RegisteredUsersApiService {
  api: ApiService = inject(ApiService);

  getRegisteredUsers(): Observable<RegisteredUsersDto[]> {
    return this.api.get<RegisteredUsersDto[]>('/auth/admin/registration');
  }

  registerUser(request: AdminRegisterRequest): Observable<RegisteredUsersDto> {
    return this.api.post<RegisteredUsersDto>('/auth/admin/registration', request);
  }

  confirmPayment(reservationId: number): Observable<void> {
    return this.api.post<void>(
      `auth/admin/registration/${reservationId}/confirm-payment`
    );
  }

  deleteAll(): Observable<void> {
    return this.api.delete<void>('/auth/admin/registration');
  }
}

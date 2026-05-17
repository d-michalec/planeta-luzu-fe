import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class AssignHeadphonesApiService {
  api: ApiService = inject(ApiService);


  assignHeadphones(ticketUUID: string, headphonesId: number) {
    return this.api.post(
      '/auth/admin/assign-headphones',
      { ticketUUID, headphonesId }
    );
  }
}

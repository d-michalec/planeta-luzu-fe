import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';

export interface ManualAssignHeadphonesRequest {
  email: string;
  headphonesId: number;
}

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

  assignHeadphonesManually(request: ManualAssignHeadphonesRequest) {
    return this.api.post(
      '/auth/admin/assign-headphones/manual',
      request
    );
  }
}

import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { AttendeesDto, ReturnHeadphonesRequest } from '../shared/model/attendees.model';

@Injectable({
  providedIn: 'root',
})
export class AttendeesApiService {
  api: ApiService = inject(ApiService);

  getAttendees(): Observable<AttendeesDto[]> {
    return this.api.get<AttendeesDto[]>('/auth/admin/attendees');
    }

  returnHeadphones(req: ReturnHeadphonesRequest) {
    return this.api.put('/auth/admin/return-headphones', req);
  }
}

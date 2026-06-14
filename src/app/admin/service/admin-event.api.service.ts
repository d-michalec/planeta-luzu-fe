import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api/api.service';
import { EventDto } from '../../shared/services/event/event.model';

export interface CreateEventRequest {
  name: string;
  date: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminEventApiService {
  private api = inject(ApiService);

  getCurrentEvent(): Observable<EventDto | null> {
    return this.api.get<EventDto | null>('/auth/admin/event');
  }

  createEvent(request: CreateEventRequest): Observable<EventDto> {
    return this.api.post<EventDto>('/auth/admin/event', request);
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.api.delete<void>(`/auth/admin/event/${eventId}`);
  }

  deleteAllData(): Observable<void> {
    return this.api.delete<void>('/auth/admin/event/all-data');
  }
}

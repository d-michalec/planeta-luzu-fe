import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { EventDto } from './event.model';

@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  private api = inject(ApiService);

  getCurrentEvent(): Observable<EventDto | null> {
    return this.api.get<EventDto | null>('/event');
  }
}

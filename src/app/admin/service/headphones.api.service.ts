import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { HeadphonesDto } from '../shared/model/headphones.model';

@Injectable({
  providedIn: 'root',
})
export class HeadphonesApiService {
  api: ApiService = inject(ApiService);

  getHeadphones(): Observable<HeadphonesDto[]> {
    return this.api.get<HeadphonesDto[]>('/auth/admin/headphones');
  }

  createHeadphones(headphonesId: number): Observable<any> {
    return this.api.post(`/auth/admin/headphones/${headphonesId}`, {});
  }

  updateHeadphones(request: any): Observable<any> {
    return this.api.put('/auth/admin/headphones', request);
  }

  deleteHeadphones(headphonesId: number): Observable<void> {
    return this.api.delete<void>(`/auth/admin/headphones/${headphonesId}`);
  }

  deleteAll(): Observable<void> {
    return this.api.delete<void>('/auth/admin/headphones');
  }
}

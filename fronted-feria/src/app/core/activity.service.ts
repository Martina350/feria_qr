import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private readonly http: HttpClient) {}

  completeActivity(qrCodeId: string) {
    return this.http.post(`${API_BASE_URL}/activities/complete`, {
      qrCodeId,
    });
  }
}



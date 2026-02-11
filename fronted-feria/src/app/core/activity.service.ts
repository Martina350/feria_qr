import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

export type ContentType =
  | 'AHORRO'
  | 'FRAUDE'
  | 'CREDITO'
  | 'PRESUPUESTO'
  | 'INVERSION'
  | 'SEGUROS';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private readonly http: HttpClient) {}

  completeActivity(qrCodeId: string, contentType: ContentType) {
    return this.http.post(`${API_BASE_URL}/activities/complete`, {
      qrCodeId,
      contentType,
    });
  }
}



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class QrService {
  constructor(private readonly http: HttpClient) {}

  bulkCreate(codes: string[]) {
    return this.http.post<{ created: number }>(`${API_BASE_URL}/qrs/bulk`, {
      codes,
    });
  }

  getAvailable() {
    return this.http.get(`${API_BASE_URL}/qrs/available`);
  }
}



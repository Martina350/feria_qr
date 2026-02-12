import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface QRItem {
  id: string;
  code: string;
  status: string;
  assignedAt: string | null;
  student?: { id: string; firstName: string; lastName: string } | null;
}

@Injectable({ providedIn: 'root' })
export class QrService {
  constructor(private readonly http: HttpClient) {}

  bulkCreate(codes: string[]) {
    return this.http.post<{ created: number }>(`${API_BASE_URL}/qrs/bulk`, {
      codes,
    });
  }

  getAvailable(): Observable<QRItem[]> {
    return this.http.get<QRItem[]>(`${API_BASE_URL}/qrs/available`);
  }

  getAll(): Observable<QRItem[]> {
    return this.http.get<QRItem[]>(`${API_BASE_URL}/qrs`);
  }
}



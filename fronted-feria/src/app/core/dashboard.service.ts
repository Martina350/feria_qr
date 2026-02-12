import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getEntriesDashboard() {
    return this.http.get(`${API_BASE_URL}/dashboard/entries`);
  }

  getStandsDashboard() {
    return this.http.get(`${API_BASE_URL}/dashboard/stands`);
  }

  getMyStandDashboard() {
    return this.http.get(`${API_BASE_URL}/dashboard/my-stand`);
  }

  exportData() {
    return this.http.get<{ csv: string }>(`${API_BASE_URL}/dashboard/export`);
  }
}



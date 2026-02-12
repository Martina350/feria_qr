import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface Stand {
  id: string;
  name: string;
  cooperativeName: string;
  contentType: string;
  isMandatory: boolean;
}

@Injectable({ providedIn: 'root' })
export class StandService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Stand[]> {
    return this.http.get<Stand[]>(`${API_BASE_URL}/stands`);
  }

  create(data: {
    name: string;
    cooperativeName: string;
    contentType: string;
    isMandatory?: boolean;
  }) {
    return this.http.post<Stand>(`${API_BASE_URL}/stands`, data);
  }
}

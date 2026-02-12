import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export type UserRole = 'ADMIN' | 'COOPERATIVA';

export interface UserListItem {
  id: string;
  email: string;
  role: UserRole;
  standId: string | null;
  createdAt: string;
  stand?: {
    id: string;
    name: string;
    cooperativeName: string;
  } | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(`${API_BASE_URL}/users`);
  }

  updateUserRole(id: string, role: UserRole): Observable<UserListItem> {
    return this.http.patch<UserListItem>(`${API_BASE_URL}/users/${id}/role`, {
      role,
    });
  }

  updateUserStand(id: string, standId: string | null): Observable<UserListItem> {
    return this.http.patch<UserListItem>(`${API_BASE_URL}/users/${id}/stand`, {
      standId,
    });
  }
}

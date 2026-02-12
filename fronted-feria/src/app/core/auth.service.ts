import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from './api-config';

export type UserRole = 'ADMIN' | 'COOPERATIVA';

interface LoginResponse {
  accessToken: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  standId?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  readonly isAuthenticated = signal<boolean>(false);
  readonly userRole = signal<UserRole | null>(null);

  constructor(private readonly http: HttpClient) {
    const token = this.getToken();
    this.isAuthenticated.set(!!token);
    if (token) this.updateRoleFromToken(token);
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.setToken(res.accessToken);
        }),
      );
  }

  registerUser(email: string, password: string, standId?: string | null) {
    return this.http.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      standId: standId ?? null,
    });
  }

  logout() {
    this.clearToken();
    this.isAuthenticated.set(false);
    this.userRole.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
    this.updateRoleFromToken(token);
  }

  private clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  private updateRoleFromToken(token: string) {
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      ) as JwtPayload;
      this.userRole.set(payload.role ?? null);
    } catch {
      this.userRole.set(null);
    }
  }
}



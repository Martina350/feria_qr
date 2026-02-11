import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from './api-config';

export type UserRole = 'ADMIN' | 'COOPERATIVA';

interface LoginResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  readonly isAuthenticated = signal<boolean>(false);

  constructor(private readonly http: HttpClient) {
    const token = this.getToken();
    this.isAuthenticated.set(!!token);
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

  registerUser(email: string, password: string) {
    return this.http.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
    });
  }

  logout() {
    this.clearToken();
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticated.set(true);
  }

  private clearToken() {
    localStorage.removeItem(this.tokenKey);
  }
}



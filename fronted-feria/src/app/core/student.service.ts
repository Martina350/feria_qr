import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

export interface RegisterStudentDto {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  unitEducation: string;
  city: string;
  province: string;
  qrCodeId: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  constructor(private readonly http: HttpClient) {}

  registerStudent(payload: RegisterStudentDto) {
    return this.http.post(`${API_BASE_URL}/students/register`, payload);
  }
}



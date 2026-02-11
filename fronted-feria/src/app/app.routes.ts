import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterStudentComponent } from './admin/register-student.component';
import { RegisterUserComponent } from './auth/register-user.component';
import { ScanQrComponent } from './stand/scan-qr.component';
import { DashboardEntriesComponent } from './admin/dashboard-entries.component';
import { DashboardStandsComponent } from './admin/dashboard-stands.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'admin/register-student', component: RegisterStudentComponent },
  { path: 'stand/scan-qr', component: ScanQrComponent },
  { path: 'dashboard/entries', component: DashboardEntriesComponent },
  { path: 'dashboard/stands', component: DashboardStandsComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];

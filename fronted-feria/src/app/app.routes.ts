import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterStudentComponent } from './admin/register-student.component';
import { RegisterUserComponent } from './auth/register-user.component';
import { ScanQrComponent } from './stand/scan-qr.component';
import { DashboardEntriesComponent } from './admin/dashboard-entries.component';
import { DashboardStandsComponent } from './admin/dashboard-stands.component';
import { UsersListComponent } from './admin/users-list.component';
import { QrManagementComponent } from './admin/qr-management.component';
import { StandDashboardComponent } from './stand/stand-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'admin/register-student', component: RegisterStudentComponent },
  { path: 'admin/qr-management', component: QrManagementComponent },
  { path: 'admin/users', component: UsersListComponent },
  { path: 'stand/scan-qr', component: ScanQrComponent },
  { path: 'stand/dashboard', component: StandDashboardComponent },
  { path: 'dashboard/entries', component: DashboardEntriesComponent },
  { path: 'dashboard/stands', component: DashboardStandsComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];

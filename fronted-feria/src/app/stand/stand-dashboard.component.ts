import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../core/dashboard.service';
import { AuthService } from '../core/auth.service';

interface StandMetric {
  id: string;
  name: string;
  cooperativeName: string;
  contentType: string;
  metrics: {
    totalStudents: number;
    byGender: Record<string, number>;
    byAgeRange: Record<string, number>;
    byContentType: Record<string, number>;
  } | null;
}

@Component({
  selector: 'app-stand-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stand-dashboard.component.html',
  styleUrls: ['./stand-dashboard.component.css'],
})
export class StandDashboardComponent {
  private readonly dashboards = inject(DashboardService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<StandMetric | null>(null);

  constructor() {
    if (this.auth.userRole() !== 'COOPERATIVA') {
      this.router.navigateByUrl('/dashboard/entries');
      return;
    }
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.dashboards.getMyStandDashboard().subscribe({
      next: (res) => {
        this.loading.set(false);
        this.data.set(res as StandMetric);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las métricas de tu stand.');
      },
    });
  }
}

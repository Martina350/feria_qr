import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../core/dashboard.service';

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
  selector: 'app-dashboard-stands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stands.component.html',
  styleUrls: ['./dashboard-stands.component.css'],
})
export class DashboardStandsComponent {
  private readonly dashboards = inject(DashboardService);

  loading = signal(false);
  error = signal<string | null>(null);
  data = signal<StandMetric[]>([]);

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.dashboards.getStandsDashboard().subscribe({
      next: (res) => {
        this.loading.set(false);
        this.data.set(res as StandMetric[]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las métricas por stand.');
        // eslint-disable-next-line no-console
        console.error(err);
      },
    });
  }
}



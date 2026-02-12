import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../core/dashboard.service';

interface EntriesDashboard {
  totalStudents: number;
  byGender: { gender: string; count: number }[];
  byAgeRange: Record<string, number>;
  byEducationUnit: Record<string, number>;
}

@Component({
  selector: 'app-dashboard-entries',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-entries.component.html',
  styleUrls: ['./dashboard-entries.component.css'],
})
export class DashboardEntriesComponent {
  private readonly dashboards = inject(DashboardService);

  loading = signal(false);
  error = signal<string | null>(null);
  data = signal<EntriesDashboard | null>(null);
  exporting = signal(false);

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.dashboards.getEntriesDashboard().subscribe({
      next: (res) => {
        this.loading.set(false);
        this.data.set(res as EntriesDashboard);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las métricas de ingresos.');
        // eslint-disable-next-line no-console
        console.error(err);
      },
    });
  }

  exportCsv() {
    this.exporting.set(true);
    this.dashboards.exportData().subscribe({
      next: (res) => {
        this.exporting.set(false);
        const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `feria-ingresos-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.exporting.set(false),
    });
  }
}



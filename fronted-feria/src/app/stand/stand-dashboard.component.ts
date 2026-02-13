import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
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

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  OTHER: 'Otro',
};

@Component({
  selector: 'app-stand-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
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

  genderChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  ageChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

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
        if (res) {
          const d = res as StandMetric;
          this.data.set(d);
          if (d.metrics) {
            this.genderChartData = this.buildGenderChartData(d.metrics.byGender);
            this.ageChartData = this.buildAgeChartData(d.metrics.byAgeRange);
          }
        } else {
          this.error.set('No tienes un stand asignado. Un administrador puede asignarte uno en la sección Usuarios. Después cierra sesión y vuelve a iniciar sesión.');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudieron cargar las métricas de tu stand.');
      },
    });
  }

  private buildGenderChartData(byGender: Record<string, number>): ChartConfiguration<'pie'>['data'] {
    const entries = Object.entries(byGender).filter(([, v]) => v > 0);
    return {
      labels: entries.map(([k]) => GENDER_LABELS[k] ?? k),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: ['#3b82f6', '#ec4899', '#10b981'],
        hoverBackgroundColor: ['#2563eb', '#db2777', '#059669'],
      }],
    };
  }

  private buildAgeChartData(byAgeRange: Record<string, number>): ChartConfiguration<'pie'>['data'] {
    const entries = Object.entries(byAgeRange).filter(([, v]) => v > 0);
    return {
      labels: entries.map(([k]) => `${k} años`),
      datasets: [{
        data: entries.map(([, v]) => v),
        backgroundColor: ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#84cc16'],
        hoverBackgroundColor: ['#7c3aed', '#0891b2', '#d97706', '#dc2626', '#65a30d'],
      }],
    };
  }
}

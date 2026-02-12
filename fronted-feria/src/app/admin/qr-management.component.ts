import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrService, QRItem } from '../core/qr.service';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-management.component.html',
  styleUrls: ['./qr-management.component.css'],
})
export class QrManagementComponent {
  private readonly qrService = inject(QrService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  qrs = signal<QRItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  bulkCodes = signal('');
  bulkLoading = signal(false);
  bulkSuccess = signal<string | null>(null);

  constructor() {
    if (!this.auth.isAuthenticated() || this.auth.userRole() !== 'ADMIN') {
      this.router.navigateByUrl('/dashboard/entries');
      return;
    }
    this.loadQrs();
  }

  loadQrs() {
    this.loading.set(true);
    this.error.set(null);
    this.qrService.getAll().subscribe({
      next: (list) => {
        this.qrs.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'No se pudo cargar los QRs.');
        this.loading.set(false);
      },
    });
  }

  bulkCreate() {
    const text = this.bulkCodes().trim();
    if (!text) return;

    const codes = text
      .split(/[\n,;]+/)
      .map((c) => c.trim())
      .filter(Boolean);

    if (!codes.length) {
      this.bulkSuccess.set('Ingresa al menos un código.');
      return;
    }

    this.bulkLoading.set(true);
    this.bulkSuccess.set(null);
    this.qrService.bulkCreate(codes).subscribe({
      next: (res) => {
        this.bulkLoading.set(false);
        this.bulkSuccess.set(`Se crearon ${res.created} QR(s).`);
        this.bulkCodes.set('');
        this.loadQrs();
      },
      error: (err) => {
        this.bulkLoading.set(false);
        this.bulkSuccess.set(err?.error?.message ?? 'Error al crear QRs.');
      },
    });
  }
}

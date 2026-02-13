import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivityService } from '../core/activity.service';
import { AuthService } from '../core/auth.service';
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ID = 'qr-reader';

@Component({
  selector: 'app-scan-qr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.css'],
})
export class ScanQrComponent implements OnInit, OnDestroy {
  private readonly activities = inject(ActivityService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  cameraError = signal<string | null>(null);
  scannerReady = signal(false);

  private scanner: Html5Qrcode | null = null;

  constructor() {
    if (this.auth.userRole() !== 'COOPERATIVA') {
      this.router.navigateByUrl('/dashboard/entries');
    }
  }

  ngOnInit(): void {
    this.startScanner();
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  private startScanner() {
    if (!document.getElementById(SCANNER_ID)) {
      setTimeout(() => this.startScanner(), 50);
      return;
    }

    this.scanner = new Html5Qrcode(SCANNER_ID);
    const config = {
      fps: 10,
      qrbox: (w: number, h: number) => {
        const minEdge = Math.min(w, h);
        const size = Math.floor(minEdge * 0.7);
        return { width: size, height: size };
      },
      aspectRatio: 1.0,
    };

    this.scanner
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText) => this.onScanSuccess(decodedText),
        () => {}
      )
      .then(() => {
        this.scannerReady.set(true);
        this.cameraError.set(null);
      })
      .catch((err) => {
        this.cameraError.set(
          'No se pudo acceder a la cámara. Verifica los permisos del navegador.'
        );
        console.error('Camera error:', err);
      });
  }

  private onScanSuccess(decodedText: string) {
    const code = this.extractCode(decodedText);
    if (!code || this.loading()) return;

    this.stopScanner();
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.activities.completeActivity(code).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Actividad registrada correctamente.');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ?? 'No se pudo registrar la actividad. Intenta nuevamente.'
        );
        this.startScanner();
      },
    });
  }

  private extractCode(text: string): string {
    const t = text.trim();
    if (!t) return '';

    try {
      if (t.startsWith('http://') || t.startsWith('https://')) {
        const url = new URL(t);
        const path = url.pathname;
        const parts = path.split('/').filter(Boolean);
        return parts[parts.length - 1] || t;
      }
    } catch {
      /* invalid URL, use raw */
    }
    return t;
  }

  private stopScanner() {
    if (this.scanner?.isScanning) {
      this.scanner.stop().catch(() => {});
      this.scannerReady.set(false);
    }
    this.scanner = null;
  }

  scanAgain() {
    this.success.set(null);
    this.error.set(null);
    this.cameraError.set(null);
    setTimeout(() => this.startScanner(), 100);
  }
}

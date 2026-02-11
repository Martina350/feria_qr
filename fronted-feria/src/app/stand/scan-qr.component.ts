import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService, ContentType } from '../core/activity.service';

@Component({
  selector: 'app-scan-qr',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.css'],
})
export class ScanQrComponent {
  private readonly fb = inject(FormBuilder);
  private readonly activities = inject(ActivityService);

  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  form = this.fb.group({
    qrCodeId: ['', Validators.required],
    contentType: ['AHORRO' as ContentType, Validators.required],
  });

  submit() {
    if (this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const value = this.form.getRawValue();

    this.activities
      .completeActivity(value.qrCodeId ?? '', (value.contentType ?? 'AHORRO') as ContentType)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Actividad registrada correctamente.');
          this.form.reset({ contentType: 'AHORRO' });
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err?.error?.message ?? 'No se pudo registrar la actividad. Intenta nuevamente.',
          );
        },
      });
  }
}



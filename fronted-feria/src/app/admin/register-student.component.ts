import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../core/student.service';
import { QrService, QRItem } from '../core/qr.service';

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css'],
})
export class RegisterStudentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly students = inject(StudentService);
  private readonly qrService = inject(QrService);

  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  availableQrs = signal<QRItem[]>([]);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    age: [null as number | null, [Validators.required, Validators.min(5), Validators.max(25)]],
    gender: ['OTHER', Validators.required],
    unitEducation: ['', Validators.required],
    city: ['', Validators.required],
    province: ['', Validators.required],
    qrCodeId: ['', Validators.required],
  });

  ngOnInit() {
    this.qrService.getAvailable().subscribe({
      next: (list) => this.availableQrs.set(list),
      error: () => this.availableQrs.set([]),
    });
  }

  submit() {
    if (this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const value = this.form.getRawValue();

    this.students
      .registerStudent({
        firstName: value.firstName ?? '',
        lastName: value.lastName ?? '',
        age: value.age ?? 0,
        gender: (value.gender ?? 'OTHER') as any,
        unitEducation: value.unitEducation ?? '',
        city: value.city ?? '',
        province: value.province ?? '',
        qrCodeId: value.qrCodeId ?? '',
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Estudiante registrado correctamente.');
          this.form.reset({ gender: 'OTHER' });
          this.qrService.getAvailable().subscribe({
            next: (list) => this.availableQrs.set(list),
          });
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err?.error?.message ?? 'No se pudo registrar al estudiante. Intenta nuevamente.',
          );
        },
      });
  }
}



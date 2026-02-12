import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { StandService, Stand } from '../core/stand.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly standService = inject(StandService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  stands = signal<Stand[]>([]);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    standId: ['', Validators.required],
  });

  ngOnInit() {
    this.standService.getAll().subscribe({
      next: (list) => this.stands.set(list),
      error: () => this.stands.set([]),
    });
  }

  submit() {
    if (this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const { email, password, confirmPassword, standId } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.loading.set(false);
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.auth
      .registerUser(email ?? '', password ?? '', standId || null)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Usuario creado correctamente. Ahora puedes iniciar sesión.');
          setTimeout(() => this.router.navigateByUrl('/login'), 1200);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err?.error?.message ?? 'No se pudo registrar el usuario. Intenta nuevamente.',
          );
        },
      });
  }
}



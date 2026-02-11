import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const { email, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.loading.set(false);
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.auth
      .registerUser(email ?? '', password ?? '')
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



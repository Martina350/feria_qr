import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, UserListItem, UserRole } from '../core/user.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  users = signal<UserListItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  updatingId = signal<string | null>(null);

  constructor() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.auth.userRole() !== 'ADMIN') {
      this.router.navigateByUrl('/dashboard/entries');
      return;
    }
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);
    this.userService.getUsers().subscribe({
      next: (list) => {
        this.users.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          err?.error?.message ?? 'No se pudo cargar la lista de usuarios.'
        );
        this.loading.set(false);
      },
    });
  }

  changeRole(user: UserListItem, newRole: UserRole) {
    if (user.role === newRole) return;
    this.updatingId.set(user.id);
    this.userService.updateUserRole(user.id, newRole).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (u.id === user.id ? { ...u, role: updated.role } : u))
        );
        this.updatingId.set(null);
      },
      error: (err) => {
        this.error.set(
          err?.error?.message ?? 'No se pudo actualizar el rol.'
        );
        this.updatingId.set(null);
      },
    });
  }
}

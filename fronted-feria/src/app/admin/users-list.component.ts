import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, UserListItem, UserRole } from '../core/user.service';
import { StandService, Stand } from '../core/stand.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly standService = inject(StandService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  users = signal<UserListItem[]>([]);
  stands = signal<Stand[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  updatingId = signal<string | null>(null);

  ngOnInit() {
    this.standService.getAll().subscribe({
      next: (list) => this.stands.set(list),
      error: () => this.stands.set([]),
    });
  }

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

  changeStand(user: UserListItem, standId: string) {
    const newStandId = standId || null;
    if (user.standId === newStandId) return;
    this.updatingId.set(user.id);
    this.userService.updateUserStand(user.id, newStandId).subscribe({
      next: (updated) => {
        this.users.update((list) =>
          list.map((u) => (u.id === user.id ? { ...u, standId: updated.standId, stand: updated.stand } : u))
        );
        this.updatingId.set(null);
      },
      error: (err) => {
        this.error.set(
          err?.error?.message ?? 'No se pudo actualizar el stand.'
        );
        this.updatingId.set(null);
      },
    });
  }
}

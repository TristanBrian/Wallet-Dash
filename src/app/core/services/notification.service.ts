import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_PATHS } from '../constants/api.constants';
import { AppNotification } from '../models/notification.model';
import { UserProfile } from '../models/user.model';

/**
 * NotificationService — manages in-app notifications and user profile.
 * Combines HTTP loading with Signal-based unread count for reactive toolbar badge.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly _notifications = signal<AppNotification[]>([]);
  private readonly _user = signal<UserProfile | null>(null);

  readonly notifications = this._notifications.asReadonly();
  readonly user = this._user.asReadonly();
  readonly unreadCount = computed(() => this._notifications().filter((n) => !n.read).length);

  loadNotifications() {
    return this.http
      .get<AppNotification[]>(`${environment.apiBaseUrl}${API_PATHS.notifications}`)
      .pipe(tap((data) => this._notifications.set(data)));
  }

  loadUser() {
    return this.http
      .get<UserProfile>(`${environment.apiBaseUrl}${API_PATHS.user}`)
      .pipe(tap((data) => this._user.set(data)));
  }

  markAsRead(id: string): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  markAllRead(): void {
    this._notifications.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  updateUser(user: UserProfile): void {
    this._user.set(user);
  }
}

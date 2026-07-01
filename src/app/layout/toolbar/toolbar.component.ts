import { Component, inject, output, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    SearchBarComponent,
    RouterLink,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  private readonly themeService = inject(ThemeService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly menuToggle = output<void>();
  readonly isDark = this.themeService.isDark;
  readonly notifications = this.notificationService.notifications;
  readonly unreadCount = this.notificationService.unreadCount;
  readonly user = this.notificationService.user;
  readonly searchQuery = signal('');

  constructor() {
    this.notificationService.loadNotifications().subscribe();
    this.notificationService.loadUser().subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  refresh(): void {
    window.location.reload();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    if (query.length > 2) {
      this.router.navigate(['/assets'], { queryParams: { q: query } });
    }
  }

  markRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllRead(): void {
    this.notificationService.markAllRead();
  }
}

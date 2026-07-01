import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CurrencyCode } from '../../core/models/user.model';

/**
 * Settings — Reactive Forms for user preferences.
 * Demonstrates two-way binding between form state and injectable services (Theme, Notifications).
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly themeService = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);

  readonly user = this.notificationService.user;
  readonly isDark = this.themeService.isDark;

  readonly profileForm = this.fb.nonNullable.group({
    name: '',
    email: '',
    currency: 'USD' as CurrencyCode,
  });

  readonly notificationForm = this.fb.nonNullable.group({
    priceAlerts: true,
    transactionUpdates: true,
    marketNews: false,
    securityAlerts: true,
  });

  ngOnInit(): void {
    this.notificationService.loadUser().subscribe((user) => {
      this.profileForm.patchValue({ name: user.name, email: user.email, currency: user.currency });
      this.notificationForm.patchValue(user.notifications);
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  saveProfile(): void {
    const user = this.user();
    if (!user) return;
    this.notificationService.updateUser({ ...user, ...this.profileForm.getRawValue() });
    this.snackBar.open('Profile saved', 'Close', { duration: 3000 });
  }

  saveNotifications(): void {
    const user = this.user();
    if (!user) return;
    this.notificationService.updateUser({ ...user, notifications: this.notificationForm.getRawValue() });
    this.snackBar.open('Notification preferences saved', 'Close', { duration: 3000 });
  }
}

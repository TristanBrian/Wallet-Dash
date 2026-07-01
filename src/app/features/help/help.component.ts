import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule, PageHeaderComponent],
  template: `
    <app-page-header title="Help" subtitle="Learning resources for this Angular project" />
    <div class="help-grid">
      @for (topic of topics; track topic.title) {
        <mat-card class="help-card">
          <mat-icon>{{ topic.icon }}</mat-icon>
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.description }}</p>
        </mat-card>
      }
    </div>
    <button mat-flat-button color="primary" routerLink="/dashboard">
      <mat-icon>arrow_back</mat-icon> Back to Dashboard
    </button>
  `,
  styles: `
    .help-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .help-card {
      padding: 1.25rem;
      mat-icon { color: var(--accent-primary); margin-bottom: 0.5rem; }
      h3 { margin: 0 0 0.5rem; }
      p { margin: 0; color: var(--text-secondary); font-size: 0.875rem; }
    }
  `,
})
export class HelpComponent {
  readonly topics = [
    { icon: 'widgets', title: 'Standalone Components', description: 'Every feature uses standalone components — no NgModules required.' },
    { icon: 'bolt', title: 'Signals', description: 'ThemeService and NotificationService use signals for reactive UI state.' },
    { icon: 'cloud_download', title: 'HttpClient', description: 'Services load mock JSON now; swap URLs for real APIs later.' },
    { icon: 'route', title: 'Lazy Routing', description: 'Each feature is lazy-loaded via loadChildren for optimal bundle size.' },
    { icon: 'edit_note', title: 'Reactive Forms', description: 'Transactions filters and Settings use ReactiveFormsModule.' },
    { icon: 'show_chart', title: 'Charts', description: 'Chart.js via ng2-charts powers portfolio and market visualizations.' },
  ];
}

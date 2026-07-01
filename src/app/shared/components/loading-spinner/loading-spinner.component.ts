import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading-spinner" role="status" aria-label="Loading">
      <mat-spinner diameter="48" />
      <span>Loading...</span>
    </div>
  `,
  styles: `
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 3rem;
      color: var(--text-secondary);
    }
  `,
})
export class LoadingSpinnerComponent {}

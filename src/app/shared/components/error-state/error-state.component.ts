import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="error-state">
      <mat-icon>error_outline</mat-icon>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <button mat-stroked-button (click)="retry.emit()">Try Again</button>
    </div>
  `,
  styles: `
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      text-align: center;
      mat-icon { font-size: 3rem; width: 3rem; height: 3rem; color: var(--color-negative); margin-bottom: 1rem; }
      h3 { margin: 0 0 0.5rem; }
      p { margin: 0 0 1.5rem; color: var(--text-secondary); }
    }
  `,
})
export class ErrorStateComponent {
  readonly title = input('Something went wrong');
  readonly message = input('Unable to load data. Please try again.');
  readonly retry = output<void>();
}

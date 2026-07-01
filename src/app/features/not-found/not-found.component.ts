import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button mat-flat-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon> Go to Dashboard
      </button>
    </div>
  `,
  styles: `
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      h1 { font-size: 6rem; margin: 0; color: var(--accent-primary); }
      p { color: var(--text-secondary); margin-bottom: 1.5rem; }
    }
  `,
})
export class NotFoundComponent {}

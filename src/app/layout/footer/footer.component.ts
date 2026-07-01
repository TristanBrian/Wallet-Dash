import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <span>© {{ year }} Wallet Dashboard — Built for learning Angular</span>
    </footer>
  `,
  styles: `
    .footer {
      padding: 0.75rem 1.5rem;
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-color);
    }
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}

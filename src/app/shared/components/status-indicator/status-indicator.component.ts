import { Component, input } from '@angular/core';
import { WalletStatus, TransactionStatus } from '../../../core/models';

@Component({
  selector: 'app-status-indicator',
  standalone: true,
  template: `
    <span class="status" [class]="'status--' + status()">{{ status() }}</span>
  `,
  styles: `
    .status {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status--active, .status--completed { background: rgba(0, 212, 170, 0.15); color: #00d4aa; }
    .status--inactive, .status--failed { background: rgba(246, 70, 93, 0.15); color: #f6465d; }
    .status--pending { background: rgba(240, 185, 11, 0.15); color: #f0b90b; }
  `,
})
export class StatusIndicatorComponent {
  readonly status = input.required<WalletStatus | TransactionStatus>();
}

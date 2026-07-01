import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  template: `
    <div class="skeleton" [style.height]="height()" [style.width]="width()"></div>
  `,
  styles: `
    .skeleton {
      background: linear-gradient(90deg, var(--surface-elevated) 25%, var(--surface-hover) 50%, var(--surface-elevated) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
})
export class SkeletonLoaderComponent {
  readonly height = input('120px');
  readonly width = input('100%');
}

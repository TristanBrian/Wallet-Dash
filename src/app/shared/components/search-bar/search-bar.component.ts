import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" class="search-bar" subscriptSizing="dynamic">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput placeholder="Search..." [ngModel]="query()" (ngModelChange)="onSearch($event)" />
    </mat-form-field>
  `,
  styles: `
    .search-bar { width: 100%; max-width: 320px; }
    mat-icon { margin-right: 0.5rem; color: var(--text-muted); }
  `,
})
export class SearchBarComponent {
  readonly query = signal('');
  readonly searchChange = output<string>();

  onSearch(value: string): void {
    this.query.set(value);
    this.searchChange.emit(value);
  }
}

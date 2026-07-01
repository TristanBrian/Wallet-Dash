import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * App root — minimal shell that delegates layout to MainLayoutComponent via routing.
 * Keeping the root component thin is an Angular best practice.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: `:host { display: block; min-height: 100dvh; }`,
})
export class App {}

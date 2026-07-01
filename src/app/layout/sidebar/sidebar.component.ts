import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NAV_ITEMS } from '../../core/constants/navigation.constants';
import { environment } from '../../../environments/environment';

/**
 * Sidebar — primary navigation using routerLink + routerLinkActive.
 * Nav items are externalized to constants for easy route additions.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly navItems = NAV_ITEMS;
  readonly appName = environment.appName;
}

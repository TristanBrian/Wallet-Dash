import { NavItem } from '../models/nav-item.model';

/**
 * Single source of truth for sidebar navigation.
 * Separating nav config from the sidebar component makes routes easy to extend.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Wallets', icon: 'account_balance_wallet', route: '/wallets' },
  { label: 'Assets', icon: 'monetization_on', route: '/assets' },
  { label: 'Transactions', icon: 'swap_horiz', route: '/transactions' },
  { label: 'Markets', icon: 'trending_up', route: '/markets' },
  { label: 'Settings', icon: 'settings', route: '/settings' },
  { label: 'Help', icon: 'help_outline', route: '/help' },
];

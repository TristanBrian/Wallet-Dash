import { Injectable, PLATFORM_ID, inject, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'wallet-dashboard-theme';

/**
 * ThemeService — manages dark/light mode using Angular Signals.
 *
 * Why Signals: theme is synchronous UI state read by many components.
 * Signals give fine-grained reactivity without RxJS overhead for a simple toggle.
 *
 * DI: providedIn 'root' makes a singleton available app-wide via inject().
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly _theme = signal<ThemeMode>(this.loadInitialTheme());

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const mode = this._theme();
      document.body.classList.toggle('dark-theme', mode === 'dark');
      document.body.classList.toggle('light-theme', mode === 'light');
      localStorage.setItem(STORAGE_KEY, mode);
    });
  }

  toggle(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setTheme(mode: ThemeMode): void {
    this._theme.set(mode);
  }

  private loadInitialTheme(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}

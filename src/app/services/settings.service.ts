import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

const PREFS_KEYS = {
  ACCENT_COLOR: 'accentColor',
};

/**
 * SettingsService
 * ----------------
 * Central place to manage user preferences (currently only `accentColor`).
 *
 * - Persists values using Capacitor Preferences so they survive app restarts.
 * - Exposes a BehaviorSubject-backed stream so components can react to changes.
 * - Mirrors the current accent color into a global CSS custom property
 *   `--app-accent-color` for easy theming in templates/SCSS.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  // Default Ionic blue accent
  private readonly defaultAccent = '#3880ff';

  private readonly accentColorSubject = new BehaviorSubject<string>(this.defaultAccent);
  readonly accentColor$ = this.accentColorSubject.asObservable();

  constructor() {
    // Load persisted preferences on service init
    this.loadPreferences();
  }

  /** Load saved preferences from device storage and publish them. */
  private async loadPreferences() {
    try {
      const { value } = await Preferences.get({ key: PREFS_KEYS.ACCENT_COLOR });
      const color = value || this.defaultAccent;
      this.setAccentColor(color, false);
    } catch (e) {
      // Fallback to default
      this.setAccentColor(this.defaultAccent, false);
    }
  }

  /**
   * Update the accent color, optionally persisting to device storage.
   * Also updates the global CSS variable used by styles and components.
   */
  async setAccentColor(color: string, persist = true) {
    this.accentColorSubject.next(color);
    // update a global CSS var for easy theming
    document.documentElement.style.setProperty('--app-accent-color', color);
    if (persist) {
      await Preferences.set({ key: PREFS_KEYS.ACCENT_COLOR, value: color });
    }
  }

  /** Get the current accent color synchronously. */
  getAccentColor(): string {
    return this.accentColorSubject.value;
  }
}

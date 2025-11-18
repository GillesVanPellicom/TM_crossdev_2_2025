import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

const PREFS_KEYS = {
  ACCENT_COLOR: 'accentColor',
};

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

  async setAccentColor(color: string, persist = true) {
    this.accentColorSubject.next(color);
    // update a global CSS var for easy theming
    document.documentElement.style.setProperty('--app-accent-color', color);
    if (persist) {
      await Preferences.set({ key: PREFS_KEYS.ACCENT_COLOR, value: color });
    }
  }

  getAccentColor(): string {
    return this.accentColorSubject.value;
  }
}

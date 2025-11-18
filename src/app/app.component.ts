import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline } from 'ionicons/icons';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Root of the application. We eagerly touch SettingsService so that
  // persisted preferences (accent color) are loaded before any UI renders.
  constructor(private readonly settings: SettingsService) {
    // Register commonly used icons globally (used by Settings buttons)
    addIcons({ settingsOutline });
    // Touch the service to ensure initialization side-effects (loading accent color)
    void this.settings; // no-op, just to keep reference
  }
}

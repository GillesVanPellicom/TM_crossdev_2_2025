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
  // Inject SettingsService so preferences load ASAP and CSS var is applied globally
  constructor(private readonly settings: SettingsService) {
    // Register commonly used icons globally
    addIcons({ settingsOutline });
    // Touch the service to ensure initialization side-effects (loading accent color)
    void this.settings; // no-op, just to keep reference
  }
}

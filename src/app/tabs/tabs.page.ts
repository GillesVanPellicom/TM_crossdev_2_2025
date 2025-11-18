import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse } from 'ionicons/icons';

/**
 * TabsPage
 * --------
 * Hosts the two calculators as tabs:
 *  - Tab1: Basic
 *  - Tab2: Scientific
 *
 * Only two icons are needed now (triangle, ellipse); Tab3 was removed.
 */
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    // Register just the icons we actually use in the tab bar
    addIcons({ triangle, ellipse });
  }
}

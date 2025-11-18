import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButtons,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { DisplayCanvasComponent } from '../ui/display-canvas/display-canvas.component';
import { SettingsModalComponent } from '../ui/settings-modal/settings-modal.component';
import { CalculatorService } from '../services/calculator.service';

/**
 * Tab1Page (Basic Calculator)
 * ---------------------------
 * UI wrapper for the basic calculator. It renders:
 *  - A header with a Settings button (opens the settings modal)
 *  - A display card with canvas + text fallback
 *  - A numeric keypad wired to CalculatorService methods
 *
 * All business logic lives in CalculatorService; this page simply forwards
 * button clicks and exposes the service to the template for live bindings.
 */
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonButtons,
    IonIcon,
    IonModal,
    DisplayCanvasComponent,
    SettingsModalComponent,
  ],
})
export class Tab1Page {
  settingsOpen = false;

  constructor(public calc: CalculatorService) {}

  openSettings() {
    this.settingsOpen = true;
  }

  onDigit(d: string) {
    this.calc.digit(d);
  }
  onOp(op: string) {
    this.calc.op(op);
  }
  onDot() {
    this.calc.dot();
  }
  onBack() {
    this.calc.backspace();
  }
  onClear() {
    this.calc.clear();
  }
  onEquals() {
    this.calc.equals();
  }
}

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
 * Tab2Page (Scientific Calculator)
 * --------------------------------
 * Extends the basic keypad with scientific functions (sin, cos, tan, sqrt,
 * ln, log), parentheses, exponent, and constants (π, e). All button actions
 * are thin wrappers that delegate to CalculatorService, which maintains the
 * shared expression/result state across tabs.
 */
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
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
export class Tab2Page {
  settingsOpen = false;

  constructor(public calc: CalculatorService) {}

  openSettings() {
    this.settingsOpen = true;
  }

  onDigit(d: string) { this.calc.digit(d); }
  onOp(op: string) { this.calc.op(op); }
  onDot() { this.calc.dot(); }
  onBack() { this.calc.backspace(); }
  onClear() { this.calc.clear(); }
  onEquals() { this.calc.equals(); }

  onPow() { this.calc.pow(); }
  onParen(ch: '(' | ')') { this.calc.paren(ch); }
  onFunc(name: 'sin'|'cos'|'tan'|'sqrt'|'ln'|'log') { this.calc.func(name); }
  onConst(name: 'pi'|'e') { this.calc.constant(name); }

}

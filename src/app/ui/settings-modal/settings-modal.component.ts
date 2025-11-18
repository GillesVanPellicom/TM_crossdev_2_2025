import { Component, EventEmitter, Output } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close.emit()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Accent color</ion-label>
          <input type="color" [ngModel]="color" (ngModelChange)="onColor($event)" style="margin-left:auto" />
        </ion-item>

        <ion-item lines="none">
          <ion-buttons slot="end">
            <ion-button color="primary" (click)="save()">Save</ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonSegment,
    IonSegmentButton,
  ],
})
export class SettingsModalComponent {
  @Output() close = new EventEmitter<void>();
  color = this.settings.getAccentColor();

  constructor(private settings: SettingsService) {}

  onColor(val: string) {
    this.color = val;
  }

  async save() {
    await this.settings.setAccentColor(this.color, true);
    this.close.emit();
  }
}

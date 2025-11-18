import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { IonItem } from '@ionic/angular/standalone';
import { Subscription, combineLatest } from 'rxjs';
import { CalculatorService } from '../../services/calculator.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-display-canvas',
  template: `
    <canvas #canvas style="width: 100%; height: 120px; display: block;"></canvas>
  `,
  standalone: true,
  imports: [NgIf, IonItem],
})
export class DisplayCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private sub?: Subscription;
  private resizeObs?: ResizeObserver;

  // Keep last known values so we can redraw on resize without peeking internals
  private lastExpr = '';
  private lastResult = '0';
  private lastColor = '#3880ff';

  constructor(
    private calc: CalculatorService,
    private settings: SettingsService
  ) {}

  ngAfterViewInit(): void {
    // Ensure the canvas has the correct backing size after it's laid out
    requestAnimationFrame(() => {
      this.resizeCanvas();
      this.draw(this.lastExpr, this.lastResult, this.lastColor);
    });

    this.sub = combineLatest([
      this.calc.expression$,
      this.calc.result$,
      this.settings.accentColor$,
    ]).subscribe(([expr, result, color]) => {
      this.lastExpr = expr;
      this.lastResult = result;
      this.lastColor = color;
      this.draw(expr, result, color);
    });

    // Initial values for last* used by resize observer
    this.lastExpr = '';
    this.lastResult = '0';
    this.lastColor = this.settings.getAccentColor();

    // Listen to element size changes using ResizeObserver for reliable layout handling
    this.resizeObs = new ResizeObserver(() => {
      this.resizeCanvas();
      this.draw(this.lastExpr, this.lastResult, this.lastColor);
    });
    this.resizeObs.observe(this.canvasRef.nativeElement);
    // Fallback: also listen to window resize
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.resizeObs?.disconnect();
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.resizeCanvas();
    // trigger redraw with last known values
    this.draw(this.lastExpr, this.lastResult, this.lastColor);
  };

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(120 * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private draw(expr: string, result: string, color: string) {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // clear
    ctx.clearRect(0, 0, w, h);

    // background (card matches)
    // draw expression small, result big, right aligned
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-step-50') || '#fff';
    // not filling background to keep ion-card style

    ctx.fillStyle = '#6b7280'; // gray-500 for expression
    ctx.font = '16px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(expr || ' ', w - 12, h - 54);

    ctx.fillStyle = color || '#3880ff';
    ctx.font = 'bold 28px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillText(result ?? '0', w - 12, h - 16);
  }
}

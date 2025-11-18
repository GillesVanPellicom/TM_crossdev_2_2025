import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Injectable({ providedIn: 'root' })
export class CalculatorService {
  private readonly exprSubject = new BehaviorSubject<string>('');
  private readonly resultSubject = new BehaviorSubject<string>('0');

  readonly expression$ = this.exprSubject.asObservable();
  readonly result$ = this.resultSubject.asObservable();

  private lastWasEquals = false;

  private async haptic(light = true) {
    try {
      await Haptics.impact({ style: light ? ImpactStyle.Light : ImpactStyle.Medium });
    } catch {}
  }

  digit(d: string) {
    this.haptic();
    if (this.lastWasEquals) {
      this.exprSubject.next('');
      this.resultSubject.next('0');
      this.lastWasEquals = false;
    }
    const expr = this.exprSubject.value + d;
    this.exprSubject.next(expr);
    this.safeEval(expr);
  }

  dot() {
    this.haptic();
    const expr = this.exprSubject.value;
    // prevent multiple dots in last number segment
    const lastNum = expr.split(/[^0-9.]/).pop() ?? '';
    if (lastNum.includes('.')) return;
    const next = expr + (lastNum === '' ? '0.' : '.');
    this.exprSubject.next(next);
  }

  op(op: string) {
    this.haptic();
    let expr = this.exprSubject.value;
    if (!expr && (op === '+' || op === '-')) {
      // allow leading + or -
      this.exprSubject.next(op);
      return;
    }
    // replace trailing operator
    if (/[+\-*/%^]$/.test(expr)) {
      expr = expr.slice(0, -1);
    }
    this.exprSubject.next(expr + op);
    this.lastWasEquals = false;
  }

  pow() {
    // insert caret which we will translate to ** on eval
    this.op('^');
  }

  paren(ch: '(' | ')') {
    this.haptic();
    const expr = this.exprSubject.value + ch;
    this.exprSubject.next(expr);
    this.lastWasEquals = false;
    this.safeEval(expr);
  }

  func(name: 'sin' | 'cos' | 'tan' | 'sqrt' | 'ln' | 'log') {
    this.haptic();
    // append function with opening paren
    const expr = this.exprSubject.value + name + '(';
    this.exprSubject.next(expr);
  }

  constant(name: 'pi' | 'e') {
    this.haptic();
    const expr = this.exprSubject.value + name;
    this.exprSubject.next(expr);
    this.safeEval(expr);
  }

  backspace() {
    this.haptic();
    const expr = this.exprSubject.value.slice(0, -1);
    this.exprSubject.next(expr);
    this.safeEval(expr);
  }

  clear() {
    this.haptic();
    this.exprSubject.next('');
    this.resultSubject.next('0');
    this.lastWasEquals = false;
  }

  equals() {
    this.haptic(false);
    const expr = this.exprSubject.value;
    const r = this.safeEval(expr);
    if (r !== null) {
      this.exprSubject.next(String(r));
      this.resultSubject.next(String(r));
      this.lastWasEquals = true;
    }
  }

  private safeEval(expr: string): number | null {
    if (!expr) {
      this.resultSubject.next('0');
      return null;
    }
    // disallow invalid characters (allow digits, ops, dot, parens, letters for functions/constants)
    if (/[^0-9+\-*/%^().a-z]/i.test(expr)) return null;
    if (/[+\-*/%^]$/.test(expr)) return null;
    try {
      // Map user-friendly tokens to JS/Math equivalents
      let js = expr;
      // percent handling: apply to the immediate number before % like /100
      js = js.replace(/%/g, '/100');
      // exponent caret to **
      js = js.replace(/\^/g, '**');
      // functions -> Math.* (ln = log, log = log10)
      js = js.replace(/\bsin\s*\(/g, 'Math.sin(');
      js = js.replace(/\bcos\s*\(/g, 'Math.cos(');
      js = js.replace(/\btan\s*\(/g, 'Math.tan(');
      js = js.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
      js = js.replace(/\bln\s*\(/g, 'Math.log(');
      // log base 10 if available else change to Math.log10 or Math.log(x)/Math.LN10
      js = js.replace(/\blog\s*\(/g, 'Math.log10(');
      // constants
      js = js.replace(/\bpi\b/gi, 'Math.PI');
      js = js.replace(/\be\b/g, 'Math.E');
      // Provide Math.log10 polyfill in expression context by pre-defining
      // eslint-disable-next-line no-new-func
      const fn = new Function('with(Math){return (' + js + ')}');
      let val = fn();
      if (typeof val !== 'number' || !isFinite(val)) return null;
      // round to 10 decimals to avoid FP noise
      val = Math.round(val * 1e10) / 1e10;
      this.resultSubject.next(String(val));
      return val;
    } catch {
      return null;
    }
  }
}

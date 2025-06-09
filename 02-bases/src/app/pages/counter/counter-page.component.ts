import { Component, signal } from '@angular/core';

@Component({
  templateUrl: './counter-page.component.html',
  styles: `
  button {
    padding:5px;
    margin: 5px 10px;
    width: 75px;
  }`,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterPageComponent {
  counter = 10;
  counterSignal = signal(10);

  // METODOS
  increaseBy(value: number) {
    this.counter += value;
    this.counterSignal.update((current) => current + value);
  }

  resetCounter(value: number) {
    this.counter = 0;
    this.counterSignal.set(0);
  }
}

import { UpperCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  templateUrl: './hero-page.component.html',
  imports: [UpperCasePipe],
})
export class HeroPageComponent {
  // Señales, cambia el estado de la aplicacion
  name = signal('Ironman');
  age = signal(45);

  // Señal Computada. Solo lectura

  heroDescription = computed(() => {
    const description = `${this.name()} - ${this.age()}`;
    return description;
  });

  // capitalizedName = computed(() => this.name().toUpperCase());

  // Metodos
  changeHero() {
    this.name.set('Spiderman');
    this.age.set(22);
  }

  changeAge() {
    this.age.set(60);
  }
  resetForm() {
    this.name.set('Ironman');
    this.age.set(45);
  }
}

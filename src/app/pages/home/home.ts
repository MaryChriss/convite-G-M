import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  meses = 0;
  semanas = 0;
  dias = 0;
  horas = 0;
  minutos = 0;
  segundos = 0;

  animMeses = false;
  animSemanas = false;
  animDias = false;
  animHoras = false;
  animMinutos = false;
  animSegundos = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const dataEvento = new Date('2027-03-27T00:00:00');

    setInterval(() => {
      const agora = new Date();
      let diff = dataEvento.getTime() - agora.getTime();

      if (diff <= 0) return;

      const novosSegundos = Math.floor((diff / 1000) % 60);
      const novosMinutos = Math.floor((diff / (1000 * 60)) % 60);
      const novasHoras = Math.floor((diff / (1000 * 60 * 60)) % 24);

      const totalDias = Math.floor(diff / (1000 * 60 * 60 * 24));

      let anoAtual = agora.getFullYear();
      let mesAtual = agora.getMonth();
      let anoEvento = dataEvento.getFullYear();
      let mesEvento = dataEvento.getMonth();

      const novosMeses = (anoEvento - anoAtual) * 12 + (mesEvento - mesAtual);

      let dataTemp = new Date(agora);
      dataTemp.setMonth(dataTemp.getMonth() + novosMeses);

      let diffRestante = dataEvento.getTime() - dataTemp.getTime();
      let diasRestantes = Math.floor(diffRestante / (1000 * 60 * 60 * 24));

      const novasSemanas = Math.floor(diasRestantes / 7);
      const novosDias = diasRestantes % 7;

      if (this.meses !== novosMeses) {
        this.meses = novosMeses;
        this.triggerAnim('animMeses');
      }
      if (this.semanas !== novasSemanas) {
        this.semanas = novasSemanas;
        this.triggerAnim('animSemanas');
      }
      if (this.dias !== novosDias) {
        this.dias = novosDias;
        this.triggerAnim('animDias');
      }
      if (this.horas !== novasHoras) {
        this.horas = novasHoras;
        this.triggerAnim('animHoras');
      }
      if (this.minutos !== novosMinutos) {
        this.minutos = novosMinutos;
        this.triggerAnim('animMinutos');
      }
      if (this.segundos !== novosSegundos) {
        this.segundos = novosSegundos;
        this.triggerAnim('animSegundos');
      }

      this.cdr.detectChanges();
    }, 1000);
  }

  triggerAnim(prop: string) {
    (this as any)[prop] = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      (this as any)[prop] = true;
      this.cdr.detectChanges();
    }, 10);
  }
}

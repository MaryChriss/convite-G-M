import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements OnInit, OnDestroy {
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

  private readonly dataEvento = new Date('2027-05-23T16:00:00');
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.atualizarContagem();
    this.intervalId = setInterval(() => this.atualizarContagem(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private atualizarContagem() {
    const agora = new Date();
    const diff = this.dataEvento.getTime() - agora.getTime();

    if (diff <= 0) return;

    const novosSegundos = Math.floor((diff / 1000) % 60);
    const novosMinutos = Math.floor((diff / (1000 * 60)) % 60);
    const novasHoras = Math.floor((diff / (1000 * 60 * 60)) % 24);

    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();
    const anoEvento = this.dataEvento.getFullYear();
    const mesEvento = this.dataEvento.getMonth();

    let novosMeses = (anoEvento - anoAtual) * 12 + (mesEvento - mesAtual);

    let dataTemp = new Date(agora);
    dataTemp.setMonth(dataTemp.getMonth() + novosMeses);

    // Se o dia de hoje for depois do dia do evento, o último mês ainda não está completo
    if (dataTemp > this.dataEvento) {
      novosMeses--;
      dataTemp = new Date(agora);
      dataTemp.setMonth(dataTemp.getMonth() + novosMeses);
    }

    const diffRestante = this.dataEvento.getTime() - dataTemp.getTime();
    const diasRestantes = Math.floor(diffRestante / (1000 * 60 * 60 * 24));

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

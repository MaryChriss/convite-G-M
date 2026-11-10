import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import QRCode from 'qrcode';
import { Header } from '../../components/header/header';
import { Presente, PresentesService } from '../../services/presentes';
import { gerarPixCopiaECola } from '../../services/pix';
import { PIX } from '../../config';

type Etapa = 'pagar' | 'obrigado';

@Component({
  selector: 'app-gifts',
  imports: [Header, FormsModule, NgTemplateOutlet],
  templateUrl: './gifts.html',
  styleUrl: './gifts.css',
})
export class Gifts implements OnInit {
  private presentesService = inject(PresentesService);

  readonly pixConfigurado = Boolean(PIX.chave && PIX.nomeRecebedor && PIX.cidade);

  presentes = signal<Presente[]>([]);
  carregando = signal(true);
  erroAoCarregar = signal(false);

  cotas = computed(() => this.presentes().filter((p) => p.tipo === 'cota'));
  unicos = computed(() => this.presentes().filter((p) => p.tipo === 'unico'));

  selecionado = signal<Presente | null>(null);
  etapa = signal<Etapa>('pagar');
  qrCode = signal('');
  copiaECola = signal('');
  copiado = signal(false);
  enviando = signal(false);
  erroEnvio = signal('');

  nome = '';
  mensagem = '';

  ngOnInit() {
    this.carregarPresentes();
  }

  carregarPresentes() {
    this.presentesService.getPresentes().subscribe({
      next: (lista) => {
        this.presentes.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
        this.erroAoCarregar.set(true);
      },
    });
  }

  async abrir(presente: Presente) {
    this.selecionado.set(presente);
    this.etapa.set('pagar');
    this.erroEnvio.set('');
    this.copiado.set(false);
    this.qrCode.set('');

    if (!this.pixConfigurado) return;

    const codigo = gerarPixCopiaECola({
      chave: PIX.chave,
      nomeRecebedor: PIX.nomeRecebedor,
      cidade: PIX.cidade,
      valor: presente.valor,
      identificador: `PRESENTE${presente.id}`,
    });
    this.copiaECola.set(codigo);
    this.qrCode.set(
      await QRCode.toDataURL(codigo, {
        margin: 1,
        width: 440,
        color: { dark: '#2b2925', light: '#ffffff' },
      }),
    );
  }

  @HostListener('document:keydown.escape')
  fechar() {
    this.selecionado.set(null);
  }

  async copiar() {
    try {
      await navigator.clipboard.writeText(this.copiaECola());
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2500);
    } catch {
      this.erroEnvio.set('Não foi possível copiar. Selecione o código e copie manualmente.');
    }
  }

  confirmar() {
    const presente = this.selecionado();
    if (!presente || this.enviando()) return;

    if (!this.nome.trim()) {
      this.erroEnvio.set('Informe seu nome para os noivos saberem quem presenteou.');
      return;
    }

    this.enviando.set(true);
    this.erroEnvio.set('');

    this.presentesService
      .registrarContribuicao(presente.id, this.nome.trim(), this.mensagem.trim())
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.etapa.set('obrigado');
          this.carregarPresentes();
        },
        error: (err: HttpErrorResponse) => {
          this.enviando.set(false);
          this.erroEnvio.set(
            err.status === 409
              ? 'Esse presente acabou de ser dado por outro convidado. Que tal escolher outro?'
              : 'Não conseguimos registrar agora. Tente novamente em instantes.',
          );
          if (err.status === 409) this.carregarPresentes();
        },
      });
  }

  formatarValor(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}

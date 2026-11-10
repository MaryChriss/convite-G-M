import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Convidado, ConvidadosService } from '../../services/convidados';

@Component({
  selector: 'app-confirmation',
  imports: [Header, FormsModule, CommonModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation implements OnInit {
  searchTerm = '';
  guests: Convidado[] = [];
  filteredGuests: Convidado[] = [];
  selectedGuest: Convidado | null = null;
  confirmationSent = false;
  confirming = false;
  confirmError = false;
  loading = true;
  error = false;
  alreadyConfirmed = false;

  constructor(
    private convidadosService: ConvidadosService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.convidadosService.getConvidados().subscribe({
      next: (data) => {
        this.guests = data;
        this.loading = false;
        this.updateFilteredList();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      },
    });
  }

  filterList() {
    this.updateFilteredList();
    this.selectedGuest = null;
    this.confirmationSent = false;
  }

  selectGuest(guest: Convidado) {
    this.selectedGuest = guest;
    this.confirmationSent = false;
    this.confirmError = false;
  }

  confirmPresence() {
    if (!this.selectedGuest || this.confirming) return;

    this.confirming = true;
    this.confirmError = false;

    this.convidadosService.confirmarPresenca(this.selectedGuest.nome).subscribe({
      next: () => {
        this.selectedGuest!.confirmado = true;
        this.confirming = false;
        this.confirmationSent = true;
        this.updateFilteredList();
        this.cdr.detectChanges();
      },
      error: () => {
        this.confirming = false;
        this.confirmError = true;
        this.cdr.detectChanges();
      },
    });
  }

  goBack() {
    this.selectedGuest = null;
    this.confirmationSent = false;
    this.confirmError = false;
    this.searchTerm = '';
    this.updateFilteredList();
  }

  private updateFilteredList() {
    const term = this.normalizeText(this.searchTerm.trim());
    this.filteredGuests = this.guests.filter(
      (g) => !g.confirmado && this.normalizeText(g.nome).includes(term),
    );
    // Quem já confirmou some da lista; avisamos em vez de dizer "não encontrado"
    this.alreadyConfirmed = this.guests.some(
      (g) => g.confirmado && this.normalizeText(g.nome).includes(term),
    );
  }

  // Ignora acentos e maiúsculas na busca ("joao" encontra "João")
  private normalizeText(text: string) {
    return text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  }
}

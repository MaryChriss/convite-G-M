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
  loading = true;
  error = false;

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
  }

  confirmPresence() {
    if (!this.selectedGuest) return;

    this.convidadosService.confirmarPresenca(this.selectedGuest.nome).subscribe({
      next: () => {
        this.selectedGuest!.confirmado = true;
        this.confirmationSent = true;
        this.updateFilteredList();
        this.cdr.detectChanges();
      },
      error: () => alert('Erro ao confirmar. Tente novamente.'),
    });
  }

  goBack() {
    this.selectedGuest = null;
    this.confirmationSent = false;
    this.searchTerm = '';
    this.updateFilteredList();
  }

  private updateFilteredList() {
    const term = this.searchTerm.toLowerCase();
    this.filteredGuests = this.guests.filter(
      (g) => !g.confirmado && g.nome.toLowerCase().includes(term),
    );
  }
}

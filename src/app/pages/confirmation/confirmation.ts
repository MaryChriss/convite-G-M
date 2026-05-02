import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  imports: [Header, FormsModule, CommonModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation {
  searchTerm: string = '';

  guests: string[] = ['Mariana Christina', 'Maria', 'Marcela', 'Mirella Rodrigues'];

  filteredGuests: string[] = [...this.guests];

  filterList() {
    const value = this.searchTerm.toLowerCase();

    this.filteredGuests = this.guests.filter((guest) => guest.toLowerCase().includes(value));
  }
}

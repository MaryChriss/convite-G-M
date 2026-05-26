import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

export type Convidado = {
  id?: number;
  nome: string;
  confirmado: boolean;
};

type ApiConvidado = {
  id?: number;
  Id?: number;
  nome?: string;
  Nome?: string;
  confirmado?: boolean;
  Confirmado?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ConvidadosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  getConvidados() {
    return this.http
      .get<ApiConvidado[]>(`${this.apiUrl}/convidados`)
      .pipe(map((lista) => lista.map((c) => this.normalize(c))));
  }

  confirmarPresenca(nome: string) {
    return this.http
      .patch<ApiConvidado>(`${this.apiUrl}/convidados/confirmar/${encodeURIComponent(nome)}`, {})
      .pipe(map((c) => this.normalize(c)));
  }

  private normalize(c: ApiConvidado): Convidado {
    return {
      id: c.id ?? c.Id,
      nome: c.nome ?? c.Nome ?? '',
      confirmado: c.confirmado ?? c.Confirmado ?? false,
    };
  }
}

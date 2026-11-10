import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../config';

export type Presente = {
  id: number;
  nome: string;
  descricao: string | null;
  valor: number;
  imagemUrl: string | null;
  // 'unico': só pode ser dado uma vez | 'cota': pode ser dado várias vezes
  tipo: 'unico' | 'cota';
  jaPresenteado: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class PresentesService {
  private http = inject(HttpClient);

  getPresentes() {
    return this.http.get<Presente[]>(`${API_URL}/presentes`);
  }

  registrarContribuicao(presenteId: number, nome: string, mensagem: string) {
    return this.http.post<{ id: number }>(`${API_URL}/presentes/${presenteId}/contribuicoes`, {
      nome,
      mensagem,
    });
  }
}

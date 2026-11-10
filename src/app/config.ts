// Endereço do backend (CasamentoGM). Troque pelo endereço real ao publicar o site.
export const API_URL = 'http://localhost:8080';

// Dados do Pix que recebe os presentes. Enquanto a chave estiver vazia,
// a página de presentes avisa que o Pix ainda está sendo configurado.
export const PIX = {
  // CPF (só números), e-mail, celular no formato +5511999999999 ou chave aleatória
  chave: 'marychris.crf@gmail.com',
  // Nome de quem recebe, como aparece no banco (até 25 letras, sem acento)
  nomeRecebedor: 'Mariana C R Fernandes',
  // Cidade de quem recebe (até 15 letras, sem acento)
  cidade: 'Cajamar',
};

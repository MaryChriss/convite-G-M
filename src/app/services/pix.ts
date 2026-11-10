// Gera o "Pix copia e cola" (BR Code estático) seguindo o padrão EMV do Banco Central.
// O mesmo texto vira o QR Code que o convidado lê no app do banco.

export type DadosPix = {
  chave: string;
  nomeRecebedor: string;
  cidade: string;
  valor?: number;
  // Identificador que aparece no extrato (até 25 letras/números)
  identificador?: string;
};

export function gerarPixCopiaECola(dados: DadosPix): string {
  const contaPix = campo('00', 'br.gov.bcb.pix') + campo('01', dados.chave.trim());
  const identificador = apenasLetrasENumeros(dados.identificador ?? '').slice(0, 25) || '***';

  let payload =
    campo('00', '01') +
    campo('26', contaPix) +
    campo('52', '0000') +
    campo('53', '986') +
    (dados.valor ? campo('54', dados.valor.toFixed(2)) : '') +
    campo('58', 'BR') +
    campo('59', textoSimples(dados.nomeRecebedor).slice(0, 25)) +
    campo('60', textoSimples(dados.cidade).slice(0, 15)) +
    campo('62', campo('05', identificador));

  payload += '6304';
  return payload + crc16(payload);
}

// CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), exigido no campo 63
export function crc16(texto: string): string {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function campo(id: string, valor: string) {
  return id + valor.length.toString().padStart(2, '0') + valor;
}

// O BR Code só aceita caracteres simples: tira acentos e símbolos
function textoSimples(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .toUpperCase();
}

function apenasLetrasENumeros(texto: string) {
  return texto.replace(/[^A-Za-z0-9]/g, '');
}

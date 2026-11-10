import { crc16, gerarPixCopiaECola } from './pix';

describe('Pix copia e cola', () => {
  it('calcula o CRC16-CCITT padrão', () => {
    // valor de referência do CRC-16/CCITT-FALSE
    expect(crc16('123456789')).toBe('29B1');
  });

  it('monta o BR Code com chave, valor, recebedor e identificador', () => {
    const codigo = gerarPixCopiaECola({
      chave: 'noivos@exemplo.com',
      nomeRecebedor: 'Gabriela Conceição',
      cidade: 'Mairiporã',
      valor: 150,
      identificador: 'PRESENTE-2',
    });

    expect(codigo.startsWith('000201')).toBe(true);
    expect(codigo).toContain('0014br.gov.bcb.pix0118noivos@exemplo.com');
    expect(codigo).toContain('5406150.00');
    expect(codigo).toContain('5918GABRIELA CONCEICAO');
    expect(codigo).toContain('6009MAIRIPORA');
    expect(codigo).toContain('62130509PRESENTE2');

    const semCrc = codigo.slice(0, -4);
    expect(semCrc.endsWith('6304')).toBe(true);
    expect(codigo.slice(-4)).toBe(crc16(semCrc));
  });

  it('limita nome a 25 e cidade a 15 caracteres', () => {
    const codigo = gerarPixCopiaECola({
      chave: 'chave',
      nomeRecebedor: 'Um nome de recebedor muito comprido mesmo',
      cidade: 'Cidade com nome enorme',
      valor: 10,
    });

    expect(codigo).toContain('5925UM NOME DE RECEBEDOR MUIT');
    expect(codigo).toContain('6015CIDADE COM NOME');
    expect(codigo).toContain('62070503***');
  });
});

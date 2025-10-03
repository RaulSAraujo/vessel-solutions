import dayjs from 'dayjs';

/**
 * Formata uma data usando Day.js.
 * @param date A data a ser formatada (string, Date, ou objeto Day.js).
 * @param format O formato desejado (padrão: 'DD/MM/YYYY').
 * @returns A data formatada ou 'Data Inválida' se a data for inválida.
 */
export function formatDate(date: string | Date | dayjs.Dayjs | null | undefined, format = 'DD/MM/YYYY'): string {
  if (!date) {
    return '';
  }
  const d = dayjs(date);
  return d.isValid() ? d.format(format) : 'Data Inválida';
}

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 * @param value O valor numérico a ser formatado.
 * @param locale O locale para formatação (padrão: 'pt-BR').
 * @param currency A moeda a ser utilizada (padrão: 'BRL').
 * @returns O valor formatado como string de moeda.
 */
export function formatCurrency(value: number | null | undefined, locale = 'pt-BR', currency = 'BRL'): string {
  if (value === null || value === undefined) {
    // Decida o que retornar para valores nulos/indefinidos.
    // Pode ser uma string vazia, 'R\$ 0,00', ou lançar um erro.
    return '';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
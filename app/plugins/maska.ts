import { tokens } from 'maska'
import { vMaska } from 'maska/vue'

export default defineNuxtPlugin((nuxtApp) => {
    // S: Corresponde a uma única letra (maiúscula ou minúscula).
    // Exemplo de uso na máscara: "SSS" para 3 letras.
    tokens['S'] = { pattern: /[a-zA-Z]/ }

    // A: Corresponde a uma única letra e a transforma em maiúscula.
    // Exemplo de uso na máscara: "AAA" para 3 letras maiúsculas.
    tokens['A'] = { pattern: /[a-zA-Z]/, transform: (char) => char.toUpperCase() }

    // N: Corresponde a um único dígito (0-9).
    // A propriedade `repeated: true` indica que este token pode ser usado com quantificadores
    // na string da máscara, como "N+" (um ou mais dígitos) ou "N{1,5}" (1 a 5 dígitos).
    // Exemplo de uso na máscara: "NNN" para 3 dígitos, "N+" para qualquer quantidade de dígitos.
    tokens['N'] = { pattern: /[0-9]/, repeated: true }

    // P: Corresponde a um único dígito ou um único caractere especial (não-alfanumérico).
    // Renomeado de '+' para 'P' para evitar confusão com o quantificador '+' do regex.
    // `repeated: true` permite o uso com quantificadores na máscara, como "P+" ou "P{1,}".
    // Exemplo de uso na máscara: "PPP" para 3 caracteres, "P+" para qualquer quantidade.
    tokens['P'] = { pattern: /[0-9\W]/, repeated: true }

    // x: Corresponde a qualquer caractere único (letra, número, especial).
    // `repeated: true` permite o uso com quantificadores na máscara, como "x+" ou "x{1,}".
    // Exemplo de uso na máscara: "xxx" para 3 caracteres, "x+" para qualquer quantidade.
    tokens['x'] = { pattern: /[\s\S]/, repeated: true }

    // X: Corresponde a qualquer caractere único, transforma para maiúscula.
    // `repeated: true` permite o uso com quantificadores na máscara, como "X+" ou "X{1,}".
    // Exemplo de uso na máscara: "XXX" para 3 caracteres maiúsculos, "X+" para qualquer quantidade.
    tokens['X'] = { pattern: /[\s\S]/, transform: (char) => char.toUpperCase(), repeated: true }

    // B: Corresponde a qualquer caractere único, transforma para minúscula.
    // `repeated: true` permite o uso com quantificadores na máscara, como "B+" ou "B{1,}".
    // Exemplo de uso na máscara: "BBB" para 3 caracteres minúsculos, "B+" para qualquer quantidade.
    tokens['B'] = { pattern: /[\s\S]/, transform: (char) => char.toLowerCase(), repeated: true }

    nuxtApp.vueApp.directive('maska', vMaska)
})
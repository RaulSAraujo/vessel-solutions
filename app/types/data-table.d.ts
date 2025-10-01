/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @typedef {object} SortBy
 * @property {string} key - A chave da coluna pela qual ordenar.
 * @property {'asc' | 'desc'} order - A direção da ordenação ('asc' para ascendente, 'desc' para descendente).
 * Define o tipo para um objeto de ordenação.
 */
export type SortBy = { key: string; order: 'asc' | 'desc' };

/**
 * @typedef {object} GroupBy
 * @property {string} key - A chave da coluna pela qual agrupar.
 * @property {'asc' | 'desc'} order - A direção da ordenação para o agrupamento.
 * Define o tipo para um objeto de agrupamento.
 */
export type GroupBy = { key: string; order: 'asc' | 'desc' };

/**
 * @interface VDataTableServerHeader
 * Define a estrutura de um objeto de cabeçalho para a tabela de dados.
 */
export interface VDataTableServerHeader {
    title: string; // Título exibido no cabeçalho
    key: string; // Chave correspondente à propriedade do item
    value?: string; // Alias para 'key', usado em algumas versões do Vuetify
    align?: 'start' | 'end' | 'center'; // Alinhamento do texto
    sortable?: boolean; // Se a coluna pode ser ordenada
    width?: string | number; // Largura da coluna
    // Outras propriedades comuns que você pode querer adicionar:
    // filterable?: boolean;
    // class?: string | string[];
    // cellClass?: string | string[];
    // children?: VDataTableServerHeader[]; // Para cabeçalhos aninhados
}

/**
 * @typedef {VDataTableServerHeader[]} VDataTableServerHeaders
 * Define o tipo para o array de cabeçalhos da tabela.
 */
export type VDataTableServerHeaders = VDataTableServerHeader[];

/**
 * @interface VDataTableServerItem
 * Define a estrutura de um item (linha) da tabela.
 * É um Record genérico, pois os itens podem ter qualquer estrutura de dados.
 * Adicionamos 'id' como uma propriedade comum, já que é o default para itemValue.
 */
export type VDataTableServerItem = Record<string, any> & { id?: any };

/**
 * @interface VDataTableServerOptions
 * Define as opções de paginação, ordenação e filtros que são emitidas pelo
 * v-data-table-server no evento 'update:options'.
 */
export interface VDataTableServerOptions {
    page: number; // Página atual
    itemsPerPage: number; // Número de itens por página
    sortBy?: SortBy[]; // Array de critérios de ordenação
    groupBy?: GroupBy[]; // Array de critérios de agrupamento
    search?: string; // Termo de busca (se houver um campo de busca conectado)
}

/**
 * @typedef {function(VDataTableServerItem): Record<string, any>} VDataTableServerRowProps
 * Define o tipo para a função `rowProps` que retorna propriedades para cada linha.
 */
export type VDataTableServerRowProps = (item: VDataTableServerItem) => Record<string, any>;

/**
 * @interface MyDataTableServerProps
 * Interface para as propriedades (props) do componente MyDataTableServer.
 */
export interface MyDataTableServerProps {
    headers: VDataTableServerHeaders;
    items: VDataTableServerItem[];
    itemValue?: string;
    loading?: boolean;
    totalItems: number;
    showExpand?: boolean;
    showSelect?: boolean;
    multiSort?: boolean;
    rowProps?: VDataTableServerRowProps;
    density?: 'default' | 'comfortable' | 'compact';
    loadingText?: string;
    mobileBreakpoint?: string | number;

    page?: number;
    itemsPerPage?: number;
    sortBy?: SortBy[];
    selected?: any[];
    expanded?: any[];
}

/**
 * @interface MyDataTableServerEmits
 * Interface para os eventos (emits) do componente.
 */
export interface MyDataTableServerEmits {
    (e: 'update:options', options: VDataTableServerOptions): void;
    (e: 'update:page' | 'update:itemsPerPage', value: number): void;
    (e: 'update:sort-by', sortBy: SortBy[]): void;
    (e: 'update:selected' | 'update:expanded', value: any[]): void;
}
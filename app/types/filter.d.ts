/* eslint-disable @typescript-eslint/no-explicit-any */
export type FilterOption = {
    value: any;
    text: string;
}

export type FilterDefinition = {
    key: string;
    label: string;
    type: 'string' | 'number' | 'array' | 'boolean' | 'date';
    op: Operators;
    options?: FilterOption[];
    layout?: layoutFilter;
    defaultValue?: any;
}

export type Operators = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "ilike" | "is" | "in" | "cs" | "cd";

export type layoutFilter = {
    min?: number;
    max?: number;
    step?: number;
    combobox?: boolean;
    clearable?: boolean;
    multiple?: boolean;
};

export type FilterOutputValue = {
    op: string;
    value: any;
}

// Tipo para o objeto de filtros internos (apenas valores brutos)
export type InternalFilters = Record<string, any>;

// Tipo para o objeto de filtros de saída (com op e value)
export type EmittedFilters = Record<string, FilterOutputValue>;
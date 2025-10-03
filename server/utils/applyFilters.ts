/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

// Mapeamento de operadores string para métodos do Supabase
const SUPABASE_OPERATORS: { [key: string]: string } = {
    eq: "eq",     // equals
    neq: "neq",   // not equals
    gt: "gt",     // greater than
    gte: "gte",   // greater than or equals
    lt: "lt",     // less than
    lte: "lte",   // less than or equals
    like: "like", // case-sensitive pattern matching (e.g., 'value%')
    ilike: "ilike", // case-insensitive pattern matching (e.g., 'value%')
    is: "is",     // is null, is true, is false
    in: "in",     // is in a list (value should be an array)
    cs: "cs",     // contains (for arrays/jsonb)
    cd: "cd",     // contained by (for arrays/jsonb)
};

/**
 * Aplica filtros dinamicamente a uma query Supabase.
 *
 * @template Q O tipo exato do PostgrestFilterBuilder que está sendo passado.
 * @param queryBuilder A instância do Supabase PostgrestFilterBuilder.
 * @param filters Um objeto contendo os filtros a serem aplicados,
 * onde a chave é o nome do campo e o valor é um objeto { op: string; value: any }.
 * @returns O queryBuilder com os filtros aplicados, mantendo o tipo original.
 */
export function applySupabaseFilters<Q extends PostgrestFilterBuilder<any, any, any, any>>(queryBuilder: Q, filters: Record<string, { op: string; value: any }>): Q {
    const currentQuery = queryBuilder;

    for (const field in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, field)) {
            const { op, value } = filters[field];

            // Verifica se o operador é válido e existe no nosso mapeamento
            if (op && value !== undefined && SUPABASE_OPERATORS[op]) {
                const supabaseMethod = SUPABASE_OPERATORS[op];
                let processedValue = value;

                // Adiciona curingas '%' para operadores 'like' e 'ilike'
                if (op === 'like' || op === 'ilike') {
                    // Garante que o valor é uma string antes de adicionar os curingas
                    processedValue = String(value);
                    // Adiciona curingas se eles ainda não estiverem presentes
                    if (!processedValue.startsWith('%')) {
                        processedValue = `%${processedValue}`;
                    }
                    if (!processedValue.endsWith('%')) {
                        processedValue = `${processedValue}%`;
                    }
                }

                // Aplica o filtro dinamicamente.
                // O 'as any' é necessário aqui porque o TypeScript não consegue inferir
                // qual método específico (eq, ilike, etc.) será chamado dinamicamente.
                (currentQuery as any)[supabaseMethod](field, processedValue);
            } else {
                console.warn(`[applySupabaseFilters] Invalid operator or value for field '${field}': op='${op}', value='${value}'`);
            }
        }
    }

    return currentQuery;
}
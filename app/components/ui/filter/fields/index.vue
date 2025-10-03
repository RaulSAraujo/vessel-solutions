<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type {
  FilterDefinition,
  InternalFilters,
  EmittedFilters,
} from "~/types/filter";

// --- Props e Emits ---
const props = defineProps({
  filters: {
    type: Array as PropType<FilterDefinition[]>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<EmittedFilters>,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  (e: "update:modelValue" | "change", value: EmittedFilters): void;
  (e: "search"): void;
}>();

// --- Estado Interno ---
const internalFilters = ref<InternalFilters>({});

// --- Computed Properties ---
const filterDefinitionsMap = computed(() => {
  return props.filters.reduce((acc, filter) => {
    acc[filter.key] = filter;
    return acc;
  }, {} as Record<string, FilterDefinition>);
});

// --- Funções Auxiliares (Helpers) ---

/**
 * Verifica se um valor de filtro é considerado vazio.
 * @param value O valor a ser verificado.
 * @returns True se o valor for vazio, false caso contrário.
 */
const isValueEmpty = (value: any): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
};

/**
 * Transforma o modelValue (formato { key: { op, value } }) para o formato interno (key: value).
 * Considera defaultValues e tipos de filtro.
 * @param modelValue O modelValue recebido via props.
 * @returns Um objeto com os valores internos dos filtros.
 */
const transformModelValueToInternal = (
  modelValue: EmittedFilters
): InternalFilters => {
  const newInternalValues: InternalFilters = {};
  props.filters.forEach((filterDef) => {
    const mvEntry = modelValue[filterDef.key];

    if (mvEntry && typeof mvEntry === "object" && "value" in mvEntry) {
      newInternalValues[filterDef.key] = mvEntry.value;
    } else if (filterDef.defaultValue !== undefined) {
      newInternalValues[filterDef.key] = filterDef.defaultValue;
    } else if (filterDef.type === "array") {
      newInternalValues[filterDef.key] = [];
    } else if (filterDef.type === "boolean") {
      newInternalValues[filterDef.key] = undefined; // Ou false, dependendo do comportamento desejado
    } else {
      newInternalValues[filterDef.key] = null;
    }
  });
  return newInternalValues;
};

/**
 * Transforma os filtros internos (key: value) para o formato de saída ({ key: { op, value } }).
 * Inclui o operador da FilterDefinition e remove valores vazios.
 * @returns Um objeto com os filtros no formato de saída.
 */
const transformInternalToEmittedFilters = (): EmittedFilters => {
  const emittedFilters: EmittedFilters = {};
  for (const key in internalFilters.value) {
    const rawValue = internalFilters.value[key];
    const filterDef = filterDefinitionsMap.value[key];

    if (filterDef && filterDef.op && !isValueEmpty(rawValue)) {
      emittedFilters[key] = {
        op: filterDef.op,
        value: rawValue,
      };
    }
  }
  return emittedFilters;
};

// --- Lógica de Emissão ---

/**
 * Emite os filtros atuais para o componente pai.
 * Esta é a única função responsável por emitir 'update:modelValue' e 'change'.
 */
const emitCurrentFilters = () => {
  const filtersToEmit = transformInternalToEmittedFilters();
  emit("update:modelValue", filtersToEmit);
  emit("change", filtersToEmit);
};

/**
 * Manipula a atualização de um filtro individual e aciona a emissão.
 * @param key A chave do filtro que foi atualizado.
 * @param value O novo valor do filtro.
 */
const handleFilterUpdate = (key: string, value: any) => {
  internalFilters.value[key] = value;
  emitCurrentFilters();
};

// --- Ciclo de Vida e Observadores ---

// Inicializa os filtros internos quando o componente é montado.
onMounted(() => {
  internalFilters.value = transformModelValueToInternal(props.modelValue);
  emitCurrentFilters(); // Garante que o pai tenha o estado inicial formatado corretamente
});

// Observa mudanças externas em modelValue e atualiza internalFilters.
watch(
  () => props.modelValue,
  (newVal) => {
    const newInternalValues = transformModelValueToInternal(newVal);
    // Compara os objetos para evitar loops infinitos ou atualizações desnecessárias
    if (
      JSON.stringify(newInternalValues) !==
      JSON.stringify(internalFilters.value)
    ) {
      internalFilters.value = newInternalValues;
    }
  },
  { deep: true }
);
</script>

<template>
  <v-row>
    <v-col
      v-for="filter in filters"
      :key="filter.key"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <template v-if="filter.type === 'string'">
        <UiTextField
          :model-value="internalFilters[filter.key]"
          :label="filter.label"
          :clearable="filter.layout?.clearable"
          @enter="emit('search')"
          @update:model-value="(val: any) => handleFilterUpdate(filter.key, val)"
        />
      </template>

      <template v-else-if="filter.type === 'number'">
        <UiNumberField
          :model-value="internalFilters[filter.key]"
          :label="filter.label"
          :min="filter.layout?.min"
          :max="filter.layout?.max"
          :step="filter.layout?.step"
          :clearable="filter.layout?.clearable"
          @update:model-value="(val: any) => handleFilterUpdate(filter.key, val)"
        />
      </template>

      <template v-else-if="filter.type === 'array'">
        <UiSelectField
          v-if="!filter.layout?.combobox"
          :model-value="internalFilters[filter.key]"
          :label="filter.label"
          :items="filter.options || []"
          :multiple="filter.layout?.multiple"
          :clearable="filter.layout?.clearable"
          @update:model-value="(val) => handleFilterUpdate(filter.key, val)"
        />

        <UiComboboxField
          v-else
          :model-value="internalFilters[filter.key]"
          :label="filter.label"
          :items="filter.options || []"
          :multiple="filter.layout?.multiple"
          :clearable="filter.layout?.clearable"
          @update:model-value="(val) => handleFilterUpdate(filter.key, val)"
        />
      </template>

      <template v-else-if="filter.type === 'boolean'">
        <UiSwitchLock
          :model-value="internalFilters[filter.key]"
          :label="filter.label"
          @update:model-value="(val) => handleFilterUpdate(filter.key, val)"
          @switch="(val) => handleFilterUpdate(filter.key, val)"
        />
      </template>

      <template v-else-if="filter.type === 'date'">
        <UiDateField
          :model-value="internalFilters[filter.key]"
          :label="filter.label"
          :clearable="filter.layout?.clearable"
          :multiple="filter.layout?.multiple ? 'range' : 'single'"
          @save="(val) => handleFilterUpdate(filter.key, val)"
          @update:model-value="(val: any) => handleFilterUpdate(filter.key, val)"
        />
      </template>
    </v-col>

    <v-spacer />

    <v-col cols="12" sm="6" md="4" lg="3">
      <slot name="actions" />
    </v-col>
  </v-row>
</template>

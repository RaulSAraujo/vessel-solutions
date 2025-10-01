<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  /**
   * O valor selecionado do select (para v-model).
   * Pode ser um único item, um array de itens, ou null/undefined.
   */
  modelValue: {
    type: [String, Number, Object, Array, null] as PropType<any | any[] | null>, // eslint-disable-line @typescript-eslint/no-explicit-any
    default: null,
  },
  /**
   * O rótulo (label) do select.
   */
  label: {
    type: String,
    default: "",
  },
  /**
   * Array de itens para o select.
   */
  items: {
    type: Array as PropType<any[]>, // eslint-disable-line @typescript-eslint/no-explicit-any
    required: true,
  },
  /**
   * Propriedade do item a ser usada como título.
   */
  itemTitle: {
    type: [String, null],
    default: "name",
  },
  /**
   * Propriedade do item a ser usada como valor.
   */
  itemValue: {
    type: [String, null],
    default: "value",
  },
  /**
   * Se o select deve ter um botão de limpar.
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o select permite múltiplas seleções.
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o v-model deve retornar o objeto completo do item ou apenas o item-value.
   */
  returnObject: {
    type: Boolean,
    default: false,
  },
  /**
   * Altura máxima do menu dropdown. Pode ser string (ex: '200px') ou number (ex: 200).
   */
  maxHeightMenu: {
    type: [String, Number, null] as PropType<string | number | null>,
    default: null,
  },
  /**
   * O texto de placeholder do select.
   */
  placeholder: {
    type: String,
    default: undefined,
  },
  /**
   * Densidade do campo ('default', 'comfortable', 'compact').
   */
  density: {
    type: String as PropType<"default" | "comfortable" | "compact">,
    default: "compact",
  },
  /**
   * Cor do componente.
   */
  color: {
    type: String,
    default: "primary",
  },
  /**
   * Variante visual do campo ('outlined', 'filled', 'solo', 'underlined', 'plain').
   */
  variant: {
    type: String as PropType<
      "outlined" | "filled" | "solo" | "underlined" | "plain"
    >,
    default: "outlined",
  },
  /**
   * Esconde os detalhes (mensagens de erro, hints).
   */
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | "auto">,
    default: "auto",
  },
  /**
   * Define a borda arredondada.
   */
  rounded: {
    type: String,
    default: "lg",
  },
});

const emit = defineEmits(["update:modelValue"]);

/**
 * Computed property para gerenciar o v-model.
 * Garante que o valor seja lido de `modelValue` e emitido via `update:modelValue`.
 */
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <v-select
    v-model="internalValue"
    :label="label"
    :color="color"
    :items="items"
    v-bind="$attrs"
    :density="density"
    :rounded="rounded"
    :variant="variant"
    :multiple="multiple"
    :clearable="clearable"
    :item-title="itemTitle"
    :item-value="itemValue"
    :placeholder="placeholder"
    :hide-details="hideDetails"
    :return-object="returnObject"
  />
</template>

<script setup lang="ts">
import type { FilterOption } from "~/types/filter";

const props = defineProps({
  /**
   * O valor selecionado do combobox (para v-model).
   * Pode ser um único item, um array de itens, ou null/undefined.
   */
  modelValue: {
    type: [String, Number, Object, Array, null] as PropType<any | any[] | null>, // eslint-disable-line @typescript-eslint/no-explicit-any
    default: null,
  },
  /**
   * O rótulo (label) do combobox.
   */
  label: {
    type: String,
    required: true,
  },
  /**
   * Array de itens para o combobox.
   */
  items: {
    type: Array as PropType<FilterOption[]>,
    required: true,
  },
  /**
   * Propriedade do item a ser usada como título.
   */
  itemTitle: {
    type: [String, null],
    default: "text",
  },
  /**
   * Propriedade do item a ser usada como valor.
   */
  itemValue: {
    type: [String, null],
    default: "value",
  },
  /**
   * Se o combobox deve ter um botão de limpar.
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o combobox permite múltiplas seleções.
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o menu deve estar aberto por padrão.
   */
  menuOpenDefault: {
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
   * O texto de placeholder do combobox.
   */
  placeholder: {
    type: String,
    default: undefined,
  },
  /**
   * Comportamento de auto-seleção do primeiro item.
   */
  autoSelectFirst: {
    type: [Boolean, String] as PropType<boolean | "exact">,
    default: false,
  },
  /**
   * Esconde os detalhes (mensagens de erro, hints).
   */
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | "auto">,
    default: true,
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
   * Altura máxima do menu dropdown.
   */
  maxHeightMenu: {
    type: [String, Number, null] as PropType<string | number | null>,
    default: "200",
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
  <v-combobox
    v-model="internalValue"
    :label="label"
    :items="items"
    v-bind="$attrs"
    :color="color"
    :density="density"
    :variant="variant"
    :rounded="rounded"
    autocomplete="off"
    :multiple="multiple"
    :item-title="itemTitle"
    :item-value="itemValue"
    :menu="menuOpenDefault"
    :clearable="clearable"
    :placeholder="placeholder"
    :hide-details="hideDetails"
    :return-object="returnObject"
    :auto-select-first="autoSelectFirst"
    :menu-props="{
      // @ts-ignore
      'max-height': maxHeightMenu,
    }"
  >
    <!-- Slot para customizar a exibição dos itens selecionados quando multiple for true -->
    <template v-if="multiple" #selection="{ item, index }">
      <span
        v-if="index < 1"
        style="
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        "
        >{{ item.title }}</span
      >

      <span v-if="index === 1" class="text-grey text-caption align-self-center">
        (+{{ (Array.isArray(internalValue) ? internalValue.length : 0) - 1 }})
      </span>
    </template>
  </v-combobox>
</template>

<style>
/* Estilo para garantir que a seleção múltipla não ocupe muito espaço */
.v-combobox__selection {
  max-width: 70%;
}
</style>

<script setup lang="ts">
import type { PropType } from "vue";

// Definindo as props do componente
defineProps({
  /**
   * O rótulo (label) do campo.
   */
  label: {
    type: String,
    default: "",
  },
  /**
   * O texto de placeholder do campo.
   */
  placeholder: {
    type: String,
    default: "",
  },
  /**
   * O tipo de input (e.g., 'text', 'password', 'number', 'email').
   */
  type: {
    type: String,
    default: "text",
  },
  /**
   * Densidade do campo ('default', 'comfortable', 'compact').
   */
  density: {
    type: String as PropType<"default" | "comfortable" | "compact">,
    default: "compact",
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
   * Cor do campo ('primary', 'secondary', 'success', 'info', 'warning', 'error').
   */
  color: {
    type: String,
    default: "primary",
  },
  /**
   * Se o campo deve ter um botão de limpar.
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o campo está em estado de carregamento.
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o campo está desabilitado.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o campo é somente leitura.
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * Esconde os detalhes (mensagens de erro, hints). Pode ser boolean ou 'auto'.
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

defineEmits(["enter"]);
</script>

<template>
  <v-text-field
    :type="type"
    :label="label"
    :color="color"
    v-bind="$attrs"
    :rounded="rounded"
    :density="density"
    :variant="variant"
    :loading="loading"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :placeholder="placeholder"
    :hide-details="hideDetails"
    @keypress.enter="$emit('enter')"
  >
    <!-- Slots para customização avançada -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </v-text-field>
</template>

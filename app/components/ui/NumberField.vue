<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  /**
   * Valor mínimo permitido.
   */
  min: {
    type: Number,
    default: undefined,
  },
  /**
   * Valor máximo permitido.
   */
  max: {
    type: Number,
    default: undefined,
  },
  /**
   * Incremento/decremento do valor ao usar os controles.
   */
  step: {
    type: Number,
    default: 1,
  },
  /**
   * O rótulo (label) do campo.
   */
  label: {
    type: String,
    default: "",
  },
  /**
   * Número de casas decimais para o valor.
   */
  precision: {
    type: Number,
    default: 0, // Default do seu exemplo
  },
  /**
   * Se o campo está desabilitado.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Se o campo deve ter um botão de limpar.
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /**
   * O texto de placeholder do campo.
   */
  placeholder: {
    type: String,
    default: undefined,
  },
  /**
   * Variante dos controles de incremento/decremento ('stacked' ou 'split').
   */
  controlVariant: {
    type: String as PropType<"stacked" | "split">,
    default: "split",
  },
  /**
   * Esconde os detalhes (mensagens de erro, hints). Pode ser boolean ou 'auto'.
   */
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | "auto">,
    default: true,
  },
  /**
   * Se os controles devem ser exibidos dentro do campo (inset).
   */
  inset: {
    type: Boolean,
    default: false,
  },
  /**
   * Se os controles de incremento/decremento devem ser invertidos.
   */
  reverse: {
    type: Boolean,
    default: false,
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
   * Se o input de texto deve ser escondido, mostrando apenas os controles.
   */
  hideInput: {
    type: Boolean,
    default: false,
  },
  /**
   * Cor do campo ('primary', 'secondary', 'success', 'info', 'warning', 'error').
   */
  color: {
    type: String,
    default: "primary",
  },
  /**
   * Define a borda arredondada.
   */
  rounded: {
    type: String,
    default: "lg",
  },
});
</script>

<template>
  <v-number-input
    :min="min"
    :max="max"
    :step="step"
    :label="label"
    :color="color"
    :inset="inset"
    v-bind="$attrs"
    :reverse="reverse"
    :density="density"
    :variant="variant"
    :rounded="rounded"
    :disabled="disabled"
    :clearable="clearable"
    :precision="precision"
    :hide-input="hideInput"
    :placeholder="placeholder"
    :hide-details="hideDetails"
    :control-variant="controlVariant"
  >
    <!-- Slots para customização avançada -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </v-number-input>
</template>

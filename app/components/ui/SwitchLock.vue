<script setup lang="ts">
import { ref, computed, watch, toRef } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  /**
   * O valor do switch (para v-model).
   */
  modelValue: {
    type: [Boolean, null] as PropType<boolean | null>,
    default: null,
  },
  /**
   * O rótulo (label) do switch.
   */
  label: {
    type: String,
    required: true, // Mantido como required, como no original
  },
  /**
   * Se o switch deve ter o estilo 'inset'.
   */
  inset: {
    type: Boolean,
    default: true,
  },
  /**
   * Cor do switch.
   */
  color: {
    type: String,
    default: "primary",
  },
  /**
   * Densidade do switch ('default', 'comfortable', 'compact').
   */
  density: {
    type: String as PropType<"default" | "comfortable" | "compact">,
    default: "compact",
  },
  /**
   * Esconde os detalhes (mensagens de erro, hints). Pode ser boolean ou 'auto'.
   */
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | "auto">,
    default: "auto",
  },
  /**
   * Cor base do switch quando não está no estado "lock" e não é vermelho.
   * Permite definir uma cor padrão para o switch quando ele está ativo e não bloqueado.
   */
  baseColor: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "switch"]);

/**
 * Estado interno para controlar o cadeado.
 * Inicializa como true (bloqueado) para corresponder ao comportamento inicial do seu exemplo.
 */
const lock = ref(true);

/**
 * Computed property para gerenciar o v-model do v-switch.
 * Garante que o valor seja lido de `modelValue` e emitido via `update:modelValue`.
 */
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

/**
 * Lógica para alternar o estado do cadeado.
 * Emite o evento 'switch' apenas se o valor for true e o cadeado estiver destravado.
 */
const switchLock = () => {
  if (props.modelValue === true && lock.value === false) {
    emit("switch");
  }

  lock.value = !lock.value;
};

/**
 * Observa a prop `modelValue` para ajustar o estado do cadeado.
 * - Se `modelValue` for `true`, o cadeado é destravado (`lock.value = false`).
 * - Se `modelValue` for `null`, o cadeado é travado (`lock.value = true`).
 */
const propRef = toRef(props, "modelValue");
watch(
  propRef,
  (newValue) => {
    if (newValue === true) {
      lock.value = false;
    }
    if (newValue === null) {
      lock.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-switch
    v-model="internalValue"
    :label="label"
    :inset="inset"
    :color="color"
    v-bind="$attrs"
    :density="density"
    :indeterminate="lock"
    :hide-details="hideDetails"
    :base-color="!lock ? 'red' : baseColor"
  >
    <!-- Slot para o botão de cadeado -->
    <template #append>
      <v-btn
        :icon="lock ? 'mdi-lock-outline' : 'mdi-lock-open-outline'"
        variant="plain"
        @click="switchLock"
      />
    </template>
  </v-switch>
</template>

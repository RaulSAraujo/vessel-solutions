<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import Fields from "./fields/index.vue";
import GroupBtn from "./group-btn/index.vue";
import type { FilterDefinition } from "~/types/filter";

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  eventFilters: {
    type: Array as PropType<FilterDefinition[]>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "search", "clear"]);

/**
 * Computed property para gerenciar o v-model.
 * Garante que o valor seja lido de `modelValue` e emitido via `update:modelValue`.
 */
const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const resetFilters = () => {
  internalValue.value = {};
  emit("clear");
};
</script>

<template>
  <div class="mb-6">
    <Fields
      v-model="internalValue"
      :filters="eventFilters"
      class="mb-3"
      @search="emit('search', internalValue)"
    >
      <template #actions>
        <GroupBtn
          @search="emit('search', internalValue)"
          @clear="resetFilters"
        />
      </template>
    </Fields>
  </div>
</template>

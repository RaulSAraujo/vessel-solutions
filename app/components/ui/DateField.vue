<script setup lang="ts">
const props = defineProps({
  /**
   * O rótulo (label) do campo.
   */
  label: {
    type: String,
    default: "",
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
   * Esconde os detalhes (mensagens de erro, hints). Pode ser boolean ou 'auto'.
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
   * Se o campo deve aceitar múltiplos valores.
   */
  multiple: {
    type: String as PropType<"single" | "range">,
    default: "single",
  },
  /**
   * Define a borda arredondada.
   */
  rounded: {
    type: String,
    default: "lg",
  },
});

const emit = defineEmits(["enter", "save"]);

const dayjs = useDayjs();

const menu = ref<boolean>(false);
const date = ref<string | Date | Array<Date> | null>(
  props.multiple === "range" ? [] : null
);

const save = () => {
  if (props.multiple === "single") {
    if (!date.value) return;

    emit("save", dayjs(date.value as Date).format("DD/MM/YYYY"));
  } else if (props.multiple === "range") {
    const range = date.value as Array<Date>;

    if (!range || range.length < 2) return;

    const startDate = dayjs(range[0]).format("DD/MM/YYYY");

    const endDate = dayjs(range[range.length - 1]).format("DD/MM/YYYY");

    emit("save", `${startDate} - ${endDate}`);
  }

  date.value = props.multiple === "range" ? [] : null;

  menu.value = false;
};

const activeMenuRange = () => {
  if (props.multiple == "range") {
    menu.value = true;
  }
};
</script>

<template>
  <v-text-field
    v-maska="multiple === 'single' ? '##/##/####' : '##/##/####,##/##/####'"
    :label="label"
    :color="color"
    :density="density"
    :variant="variant"
    :rounded="rounded"
    :disabled="disabled"
    :clearable="clearable"
    :hide-details="hideDetails"
    @click="activeMenuRange"
    @keypress.enter="$emit('enter')"
  >
    <template #prepend-inner>
      <v-menu v-model="menu" :close-on-content-click="false">
        <template #activator="{ props: activator }">
          <v-icon color="primary" v-bind="activator">mdi-calendar</v-icon>
        </template>

        <v-confirm-edit v-model="date" @save="save">
          <template #default="{ model: proxyModel, actions }">
            <v-date-picker
              v-model="proxyModel.value"
              rounded="xl"
              show-adjacent-months
              :multiple="multiple"
            >
              <template #actions>
                <component :is="actions" />
              </template>
            </v-date-picker>
          </template>
        </v-confirm-edit>
      </v-menu>
    </template>
  </v-text-field>
</template>

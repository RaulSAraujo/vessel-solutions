<script lang="ts" setup>
import type {
  SortBy,
  VDataTableServerHeader,
  VDataTableServerOptions,
  MyDataTableServerEmits,
} from "~/types/data-table";

const props = defineProps({
  /**
   * Cabeçalhos da tabela
   */
  headers: {
    type: Array as PropType<VDataTableServerHeader[]>,
    default: () => [],
  },
  /**
   * Itens de tabela podem ser objetos com praticamente qualquer formato ou número de propriedades.
   * O único requisito é algum tipo de identificador exclusivo
   * se a seleção de linhas for utilizada.
   */
  items: {
    type: Array,
    default: () => [],
  },
  /**
   * Chave do item para o select
   */
  itemValue: {
    type: String,
    default: "id",
  },
  /**
   * As tabelas de dados oferecem suporte a três estratégias de seleção diferentes
   *
   * single - apenas um item pode ser selecionado
   * page - todos os itens da pagina podem ser selecionados
   * all - todos os itens podem ser selecionados
   */
  selectStrategy: {
    type: String as PropType<"single" | "page" | "all">,
    default: "all",
  },
  /**
   * Opção usada para exibir o carregamento da tabela
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * renderizará um ícone de expansão em cada linha e no cabeçalho padrão
   */
  showExpand: {
    type: Boolean,
    default: false,
  },
  /**
   * Array com os dados do items expandidos
   * Necessário se showExpand = true
   */
  expanded: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /**
   * renderizará uma caixa de seleção no cabeçalho padrão para alternar todas as linhas
   * e uma caixa de seleção para cada linha
   */
  showSelect: {
    type: Boolean,
    default: false,
  },
  /**
   * Array com os items selecionados
   * Necessário se showSelect = true
   */
  selected: {
    type: Array,
    default: () => [],
  },
  page: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number as PropType<10 | 25 | 50 | 100 | -1>,
    default: 10,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  multiSort: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: Array as PropType<SortBy[]>,
    default: () => [],
  },
  rowProps: {
    type: Function,
    default: () => {},
  },
});

// Define os eventos que o componente pode emitir
const emit = defineEmits<MyDataTableServerEmits>();

// --- Propriedades Computadas para v-model (Two-Way Binding) ---
// Estas propriedades permitem que o componente pai use `v-model:propName`
// para controlar o estado da tabela e reagir às suas mudanças.
const internalPage = computed({
  get: () => props.page,
  set: (value) => emit("update:page", value),
});

const internalItemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (value) => emit("update:itemsPerPage", value),
});

const internalSortBy = computed({
  get: () => props.sortBy,
  set: (value) => emit("update:sort-by", value),
});

const internalSelected = computed({
  get: () => props.selected,
  set: (value) => emit("update:selected", value),
});

const internalExpanded = computed({
  get: () => props.expanded,
  set: (value) => emit("update:expanded", value),
});

const expandedAll = ref(false);

/**
 * Alterna o estado de expansão de todas as linhas atualmente exibidas.
 * Se todas estiverem expandidas, colapsa-as; caso contrário, expande-as.
 */
const toggleExpandAll = () => {
  expandedAll.value = !expandedAll.value;

  if (expandedAll.value && props.items.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    internalExpanded.value = props.items.flatMap((e: any) => e.id) as never[];
  } else {
    internalExpanded.value = [];
  }
};

// Slots
const slots = useSlots();
const parentSlots = computed(() => Object.keys(slots));
const getSlotName = (name: string) => name as string;

// --- Manipulador do Evento `update:options` ---
// Este é o ponto chave de desacoplamento. O componente genérico apenas emite
// as opções atualizadas, deixando a responsabilidade de buscar os dados para o pai.
const handleUpdateOptions = (options: VDataTableServerOptions) => {
  emit("update:options", options);
};
</script>

<template>
  <v-data-table-server
    v-model:selected="internalSelected"
    v-model:expanded="internalExpanded"
    v-model:sort-by="internalSortBy"
    :headers="headers"
    :items="items"
    :item-value="itemValue"
    :select-strategy="selectStrategy"
    :page="internalPage"
    :items-per-page="internalItemsPerPage"
    :items-length="totalItems"
    :loading="loading"
    :show-expand="showExpand"
    :show-select="showSelect"
    :multi-sort="multiSort"
    :row-props="rowProps"
    density="compact"
    mobile-breakpoint="sm"
    @update:options="handleUpdateOptions"
  >
    <template
      v-for="slotName in parentSlots"
      :key="slotName"
      #[getSlotName(slotName)]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps" />
    </template>

    <template
      #header.data-table-select="{ selectAll, allSelected, someSelected }"
    >
      <v-checkbox
        color="primary"
        :value="!allSelected"
        :indeterminate="someSelected && !allSelected"
        hide-details
        @click="selectAll(!allSelected)"
      />
    </template>

    <template
      #item.data-table-select="{ internalItem, isSelected, toggleSelect }"
    >
      <v-checkbox-btn
        color="primary"
        :model-value="isSelected(internalItem)"
        @update:model-value="toggleSelect(internalItem)"
      />
    </template>

    <template #header.data-table-expand>
      <v-btn
        :id="expandedAll ? 'closeAll' : 'expandAll'"
        :icon="expandedAll ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        variant="plain"
        @click="toggleExpandAll"
      />
    </template>

    <template #loader="{ isActive }">
      <v-progress-linear
        v-if="isActive"
        color="primary"
        indeterminate
        height="2"
      />
    </template>
  </v-data-table-server>
</template>

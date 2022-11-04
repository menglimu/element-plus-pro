import { ElPagination } from "element-plus";
import { BaseTableProps } from "types/table";
import { ref } from "vue";

export default function usePagination(props: BaseTableProps, search: (type: string) => void) {
  const { paginationConfig } = $(props);

  const currentPage = ref(0);
  const total = ref(0);
  const pageSize = ref((paginationConfig && paginationConfig?.pageSize) || 0);
  // 分页改变
  function handleSizeChange(val: number) {
    pageSize.value = val;
    search("size-change");
    props?.["onSize-change"]?.(val);
  }
  function handleCurrentChange(val: number) {
    currentPage.value = val;
    search("current-change");
    props?.["onCurrent-change"]?.(val);
  }
  return {
    renderPagination: () =>
      paginationConfig ? (
        <ElPagination
          currentPage={currentPage.value}
          total={total.value}
          class="ml-table-pagination"
          onSize-change={handleSizeChange}
          onCurrent-change={handleCurrentChange}
          {...paginationConfig}
        />
      ) : null,
    currentPage,
    total,
    pageSize,
  };
}

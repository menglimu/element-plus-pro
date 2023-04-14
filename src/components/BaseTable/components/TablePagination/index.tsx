import { ElPagination } from "element-plus";
import { BaseTableProps, FetchListFn } from "../../src";
import { Ref, watch } from "vue";

export default function usePagination(props_: Ref<BaseTableProps["paginationProps"]>, search: FetchListFn) {
  let props = $(props_);
  let currentPage = $ref(0);
  let total = $ref(0);
  let pageSize = $ref(10);

  watch([() => props && props?.pageSize], () => {
    props && props.pageSize && (pageSize = props.pageSize);
  });
  // 分页改变
  function handleSizeChange(val: number) {
    pageSize = val;
    search("size");
  }
  function handleCurrentChange(val: number) {
    currentPage = val;
    search("current");
  }
  const renderPagination = () => {
    return (
      props !== false && (
        <ElPagination
          currentPage={currentPage}
          total={total}
          class="tablePagination"
          onUpdate:page-size={handleSizeChange}
          onUpdate:current-page={handleCurrentChange}
          {...{ layout: "total, sizes, prev, pager, next, jumper", ...props }}
        ></ElPagination>
      )
    );
  };
  return $$({
    renderPagination,
    currentPage: currentPage,
    total: total,
    pageSize: pageSize,
  });
}

// 因为cui和element的差距，使用tag来处理标签
class Tags {
  public TagButton = "button";
  public TagForm = "form";
  public TagFormItem = "form-item";
  public TagOption = "option";
  public TagTable = "table";
  public TagTableColumn = "table-column";
  public TagPagination = "pagination";

  public prefix = "";

  public constructor(framework = "element-ui") {
    this.setTags(framework);
  }
  private setTags(framework = "element-ui") {
    this.prefix = { cui: "c-", "element-ui": "el-" }[framework];
    this.TagButton = this.prefix + this.TagButton;
    this.TagForm = this.prefix + this.TagForm;
    this.TagFormItem = this.prefix + this.TagFormItem;
    this.TagOption = this.prefix + this.TagOption;
    this.TagTable = this.prefix + this.TagTable;
    this.TagTableColumn = this.prefix + this.TagTableColumn;
    this.TagPagination = this.prefix + this.TagPagination;
  }
}

export default Tags;

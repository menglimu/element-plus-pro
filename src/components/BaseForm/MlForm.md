**MlForm**

### 1.介绍

通过配置 config，生产表单

### 2.说明

| 参数   | 说明         | 类型   | 可选值 | 默认值 |
| ------ | ------------ | ------ | ------ | ------ |
| value  | 表单输出的值 | object | ——     | ——     |
| config | 表单配置项   | object | ——     | ——     |

**config**

| 参数                                   | 说明                                            | 类型    | 可选值                                | 默认值 |
| -------------------------------------- | ----------------------------------------------- | ------- | ------------------------------------- | ------ |
| labelWidth                             | label 宽度                                      | string  | ——                                    | 100px  |
| itemBoxWidth                           | 单项宽度                                        | string  | ——                                    | 33.33% |
| itemWidth                              | 单项内容宽度                                    | string  | ——                                    | 100%   |
| uiType                                 | UI 展示类型                                     | string  | line(下划线)/round(圆角)/border(边框) | border |
| format                                 | 转换输入值与输出值                              | object  | ——                                    | ——     |
| columns                                | 具体配置项列表                                  | array   | ——                                    | ——     |
| 其他具体可参考 elementui 官方文档 form | https://element.eleme.cn/#/zh-CN/component/form |
| inline                                 | 行内展示                                        | boolean | ——                                    | true   |
| clearable                              | 清空按钮                                        | boolean | ——                                    | true   |
| size                                   | 输入项大小                                      | string  | medium / small / mini                 | small  |

**format**

| 参数       | 说明                   | 类型     | 可选值 | 默认值 |
| ---------- | ---------------------- | -------- | ------ | ------ |
| toEleValue | 自定义值格式化为组件值 | function | ——     | ——     |
| toValue    | 组件值转为自定义值     | function | ——     | ——     |

**columns**

| 参数           | 说明                                                 | 类型          | 可选值                                                                                                                                                                                                                                                    | 默认值                                                                                          | 必填 |
| -------------- | ---------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---- |
| type           | 输入项类型                                           | string        | 基本输入：string / input / textarea <br>时间日期：date / dates / daterange / datetime / datetimerange / time / timerange<br> 选择类型：radio / checkbox / select / selectTree(下拉树形) / tree(树形) / svg(svg 图标选择) / color<br> 其他：editor(富文本) | ——                                                                                              | true |
| prop           | key 值                                               | string        | ——                                                                                                                                                                                                                                                        | ——                                                                                              | true |
| label          | label 文本                                           | string        | ——                                                                                                                                                                                                                                                        | ——                                                                                              | true |
| required       | 是否必填                                             | boolean       | ——                                                                                                                                                                                                                                                        | false                                                                                           |
| value          | 默认值                                               | ——            | ——                                                                                                                                                                                                                                                        | ——                                                                                              |
| placeholder    | 输入框内提示文本                                     | string        | ——                                                                                                                                                                                                                                                        | 根据 label 进行拼接                                                                             |
| tag            | 渲染的标签名                                         | string        | ——                                                                                                                                                                                                                                                        | 不填会从组件内根据类型匹配                                                                      |
| labelWidth     | 渲染的标签长度                                       | string        | ——                                                                                                                                                                                                                                                        | 不填会从父级继承                                                                                |
| itemBoxWidth   | 单项宽度                                             | string        | ——                                                                                                                                                                                                                                                        | 33.33%                                                                                          |
| itemWidth      | 单项内容宽度                                         | string        | ——                                                                                                                                                                                                                                                        | 100%                                                                                            |
| error          | 输入不符合时的提示                                   | string        | ——                                                                                                                                                                                                                                                        | 根据 label 进行拼接                                                                             |
| reg            | 正则校验                                             | string/object | ——                                                                                                                                                                                                                                                        | ——                                                                                              |
| rules          | 校验规则                                             | array         | ——                                                                                                                                                                                                                                                        | [{msg: '错误', validator(value, rootValue){}}], //msg 可为空 value：当前值，rootValue：根对象表 |
| show           | 显示条件                                             | function      | ——                                                                                                                                                                                                                                                        | show(rootValue) { //显示条件 rootValue：根对象 // return rootValue.eventType === 1 }            |
| options        | 选择项列表                                           | array         | ——                                                                                                                                                                                                                                                        | ——                                                                                              |
| optionsGet     | 异步选择项获取方法，返回 promise                     | function      | ——                                                                                                                                                                                                                                                        | ——                                                                                              |
| optionLabel    | 下拉显示的名字 key                                   | string        | ——                                                                                                                                                                                                                                                        | label                                                                                           |
| optionValue    | 下拉取值得 key                                       | string        | ——                                                                                                                                                                                                                                                        | value                                                                                           |
| optionChildren | 树形的 children 取值                                 | array         | ——                                                                                                                                                                                                                                                        | children                                                                                        |
| block          | 独占一行                                             | boolean       | ——                                                                                                                                                                                                                                                        | false                                                                                           |
| format         | 格式化输入出，参考上个表格                           | object        | ——                                                                                                                                                                                                                                                        | ——                                                                                              |
| children       | 输入项的子元素                                       | function      | ——                                                                                                                                                                                                                                                        | ——                                                                                              |
| render         | 自定义输入项的渲染                                   | function      | ——                                                                                                                                                                                                                                                        | ——                                                                                              |
| nodeData       | 其他扩展请参考 element，attrs 会通过渲染函数进行传值 | object        | ——                                                                                                                                                                                                                                                        | ——                                                                                              |

### 3.在项目中使用:

MlForm

```
<!--
 * @Author: wenlin
 * @Date: 2020-01-27 14:36:17
 * @LastEditors: wenlin
 * @LastEditTime: 2020-11-11 17:25:28
 * @Description: 表单测试页
 -->

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import { MlFormConfig, MlForm } from '../../../../../../types'
import { CreateElement } from 'vue'

@Component({
  components: {}
})
export default class FormTest extends Vue {
  addFormConfig: MlFormConfig
  $refs: {
    form: MlForm
  }
  value: any = {}

  created() {
    this.addFormConfig = {
      uiType: 'line',
      labelPosition: 'right',
      inline: true,
      itemBoxWidth: '600px',
      itemWidth: '600px',
      itemMaxWidth: '600px',
      columns: [
        {
          type: 'select',
          label: '来源区域',
          prop: 'newsSource',
          optionsGet: function() {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({
                  content: [
                    { value: '满堂花醉三千客', label: '一剑霜寒十四州' },
                    { value: '云母屏风烛影深', label: '长河渐落晓星沉' },
                    { value: '嫦娥应悔偷灵药', label: '碧海青天夜夜心' }
                  ]
                })
              }, 4000)
            })
          },
          // options: [
          //   {
          //     value: '1',
          //     label: '上下结构'
          //   },
          //   {
          //     value: '2',
          //     label: '左右结构'
          //   }
          // ],
          required: true
        },
        {
          type: 'input',
          label: '排序',
          prop: 'newsSort'
        },
        // {
        //   type: 'string',
        //   label: '标题',
        //   prop: 'newsTitle',
        //   required: true,
        //   block: true,
        //   placeholder: '自定义提示',
        //   labelWidth: '200px',
        //   itemBoxWidth: '410px',
        //   itemWidth: '400px'
        // },
        {
          type: 'input',
          label: '责任领导',
          prop: 'newsSort1',
          itemBoxWidth: '600px'
        },
        {
          type: 'checkbox',
          label: '',
          prop: 'checkbox',
          itemBoxWidth: '200px',
          render() {
            return <el-checkbox>需要xxx审批</c-checkbox>
          }
        },
        {
          type: '',
          prop: 'list',
          label: '细化指标',
          value: [],
          // eslint-disable-next-line
          render(h: CreateElement, value: any, onInput: { (value: any): void }) {
            return (
              <div>
                <el-button
                  onClick={() => {
                    const val = [...value]
                    val.push(val.length + 1)
                    onInput(val)
                  }}>
                  新增
                </c-button>
                <ul>{value && value.map((item: any) => <li>{item}</li>)}</ul>
              </div>
            )
          }
        },
        {
          type: '',
          prop: 'list1',
          label: '细化指标',
          required: true,
          // eslint-disable-next-line
          render() {
            // 自定义组件。会自动绑定value和input事件。上面的细化指标demo。可通过自定义组件来实现。
            return <el-input />
          }
        },
        {
          type: 'string',
          label: '发布人',
          prop: 'newsPromulgator',
          value: '稼轩大人',
          required: true
        },
        {
          type: 'select',
          label: '结构模式',
          prop: 'newsModel',
          options: [
            {
              value: '1',
              label: '上下结构'
            },
            {
              value: '2',
              label: '左右结构'
            }
          ],
          required: true
        },
        {
          type: 'upload',
          label: '封面图片',
          prop: 'fileIds',
          value: [],
          required: true,
          nodeData: {
            props: {
              limit: 1
            }
          },
          children() {
            return (
              <div style={{ color: '#A8B8C0', fontSize: '14px', lineHeight: '40px' }}>
                （建议大小250*138像素，图片至少上传1张）
              </div>
            )
          },
          show(value) {
            return value.newsModel == '2'
          }
        },
        {
          type: 'upload',
          label: '封面图片',
          prop: 'fileIds',
          required: true,
          value: [],
          nodeData: {
            props: {
              limit: 3
            }
          },
          show(value) {
            return value.newsModel == '1'
          }
        },
        {
          tag: 'ml-editor', //'c-table',
          type: '',
          label: '新闻内容',
          prop: 'newsContent',
          block: true
        }
      ]
    }
  }

  onClick() {
    this.$refs.form.validate()
    // this.value = ['2020/02/27/0b96d92bf1cf4500baffd6f620d1890a.jpg']
  }
  onClearValidate() {
    this.$refs.form.clearValidate()
    // this.$refs.form.validateField('fileIds')

    // this.value = ['2020/02/27/0b96d92bf1cf4500baffd6f620d1890a.jpg']
  }

  renderC() {
    return <div>ccc</div>
  }
  protected render() {
    return (
      <div>
        <ml-form ref="form" style={{ width: '800px' }} v-model={this.value} config={this.addFormConfig}></ml-form>
        {JSON.stringify(this.value)}
        <div>
          {this.renderC()}
          <el-button onClick={this.onClick}>校验</c-button>
          <el-button onClick={this.onClearValidate}>清除校验</c-button>
        </div>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped></style>

```

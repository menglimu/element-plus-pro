**MlTable**

### 1.介绍

通过配置 config，生成表格

### 2.说明

| 参数            | 说明                                               | 类型     | 可选值 | 默认值 |
| --------------- | -------------------------------------------------- | -------- | ------ | ------ |
| config          | 表格配置项                                         | object   | ——     | ——     |
| searchConfig    | 表格顶部搜索配置项                                 | object   | ——     | ——     |
| searchData      | 搜索数据                                           | object   | ——     | ——     |
| searchBtnInForm | 搜索和重置按钮在输入项后显示，！输入项不能占满元素 | Boolean  | ——     | false  |
| innerBtn        | 内部按钮组                                         | array    | ——     | ——     |
| outerBtn        | 外部按钮组                                         | array    | ——     | ——     |
| deleteBtn       | 删除按钮文本                                       | string   | ——     | ——     |
| beforeGetList   | 获取数据前的钩子函数                               | function | ——     | ——     |
| afterGetList    | 获取数据后的钩子函数                               | function | ——     | ——     |

**slot**
名字 | 说明
outerTable | 搜索栏和表格中间部分

**outerBtn/innerBtn**
参数 | 说明 | 类型 | 可选值 | 默认值 |
---|---|---|---|---|
evtType | 事件类型 | string | —— | —— |
Elicon | elementUI 的图标库 | string | —— | —— |
icon | svg 图标 | string | —— | —— |
name | 按钮名 | string | —— | —— |
selection | 多选类型，仅外部按钮可用 | string | none / single / multiple | none |
showJudge | 按钮显示隐藏 | object/function | —— | showJudge : {name: 1 ,type: 2} // showJudge: function(data){return false/true} // 可使用函数返回 true/false，判断显示，参数为行数据 |

**config**
参数 | 说明 | 类型 | 可选值 | 默认值 |
---|---|---|---|---|
selection | 是否显示多选框 | boolean | —— | true |
index | 是否显示序列号 | boolean | —— | false |
tableTree | 是否 tree，属性表格 | boolean | —— | false |
tableKey | 主键 | string | —— | 'id'
tableOptWidth | 操作栏宽度 | string | —— | ''
api | 表格操作接口 | object | —— | object:{list,delete,tree,import,export}
initSearch | 初始化的时候，是否直接请求数据 | string | —— | true |
showPagination | 是否显示分页| boolean | —— | —— |
editFromServer | 修改从服务端查询详情 | boolean | —— | false |
viewFromServer | 查看详情从服务端查询详情 | boolean | —— | false |
searchData | 搜索的默认值 | object | —— | —— |
columns | 具体配置项列表 | array | —— | —— |

**columns**
参数 | 说明 | 类型 | 可选值 | 默认值 | 是否必填 |
---|---|---|---|---|---|
type | 输入项类型 | string | 基本输入：string / phone / mail / bankCode / idCard / number / password / textarea <br>时间日期：date / dates / daterange / datetime / datetimerange / time / timerange<br> 选择类型：radio / checkbox / select / selectTree(下拉树形) / tree(树形) / svg(svg 图标选择) / color | —— | 是
prop | key 值 | string | —— | —— | 是
label | label 文本 | string | —— | —— | 是
showTable | 显示表格中 | boolean | —— | true |
searchForm | 显示在搜索框中 | boolean | —— | false |
noPre | 图片不使用预览 | boolean | —— | true |
render | 自定义表格列渲染 | function | —— | render: (h, params) => {//params: {column,index,row}//配置数据，序列号，行数据} |
其他值参考 form 配置项 |

**slot**

default：表格上和搜索框下的外部自定义

### 3.在项目中使用:

MlTable

```
<!--
 * @Author: wenlin
 * @Date: 2020-01-27 14:36:17
 * @LastEditors: wenlin
 * @LastEditTime: 2020-11-11 17:33:29
 * @Description: 表格测试页
 -->

<template>
  <div>
    <ml-table ref="mainTable" v-bind="baseTable"></ml-table>
  </div>
</template>
<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'

const tableData = [
  {
    idCcNewsManage: '8f3122df-d0a0-4ee5-8d00-65c559c8d8e3',
    newsCategory: '',
    newsTitle: '1',
    glanceNum: 0,
    newsSort: 0,
    publishTime: '2020-01-14 16:36:55',
    newsSource: '1002',
    newsStatus: '0',
    newsPromulgator: '',
    newsModel: '2',
    delFlag: '',
    creatTime: '2020-01-14 16:19:56',
    creatUser: '',
    updateTime: '2020-02-25 16:58:06',
    updateUser: '',
    delUser: '',
    remark: '',
    newsContent: '<p>111111</p>',
    sourceName: '',
    modelName: '',
    ids: '',
    fileIds: ''
  }
]

const areaList = [
  { area_code: '1001', name: '翠屏区' },
  { area_code: '1002', name: '叙州区' },
  { area_code: '1003', name: '南溪区' },
  { area_code: '1004', name: '临港经开区' },
  { area_code: '1005', name: '江安县' },
  { area_code: '1006', name: '高县' },
  { area_code: '1007', name: '珙县' },
  { area_code: '1008', name: '筠连县' },
  { area_code: '1009', name: '屏山县' },
  { area_code: '1010', name: '兴文县' },
  { area_code: '1011', name: '长宁县' }
]

interface TableData {
  idCcNewsManage?: string
  newsCategory?: string
  newsTitle?: string
  glanceNum?: number
  newsSort?: number
  publishTime?: string
  newsSource?: string
  newsStatus?: string
  newsPromulgator?: string
  newsModel?: string
  delFlag?: string
  creatTime?: string
  creatUser?: string
  updateTime?: string
  updateUser?: string
  delUser?: string
  remark?: string
  newsContent?: string
  sourceName?: string
  modelName?: string
  ids?: string
  fileIds?: string
}

interface SearchData {
  newsSource: string
}

import { MlTableProps, MlTable } from 'types'
import { CreateElement } from 'vue/types/umd'
@Component({
  name: 'tablePage',
  components: {}
})
export default class TablePage extends Vue {
  $refs: {
    mainTable: MlTable
  }
  // 先不传这2个定义。工作量较大
  // baseTable: MlTableProps<TableData, SearchData>
  baseTable: MlTableProps

  created() {
    console.log(<div></div>)
    this.baseTable = {
      searchBtnInForm: false,
      // searchConfig: {
      //   columns: [
      //     {
      //       type: 'string',
      //       label: '标题',
      //       prop: 'newsTitle',
      //       required: true
      //     }
      //   ]
      // },
      beforeGetList: () => ({ a: 123 }),
      afterGetList: (type, data) => console.log(type, data),
      searchData: {},
      deleteBtn: '删除',
      outerBtn: [
        {
          evtType: 'add',
          name: '添加'
        }
        // {
        //   evtType: 'add',
        //   Elicon: 'circle-plus-outline',
        //   name: '新增'
        // // selection: 'none' // false   不选,(其他值)， 单选，多选，single   multiple
        // // icon: svg图标
        // // showJudge : {name: 1 ,type: 2} // showJudge: function(data){return false/true} // 可使用函数返回true/false，判断显示，参数为行数据
        // }
      ],

      innerBtn: [
        // {
        //   evtType: 'change',
        //   name: '修改'
        // // icon: svg图标
        // // showJudge : {name: 1 ,type: 2} // showJudge: function(data){return false/true} // 可使用函数返回true/false，判断显示，参数为行数据
        // },
        {
          evtType: 'ml-delete',
          name: '删除z'
        }
      ],
      config: {
        // selection: false, //多选，默认true
        index: true, // 序号 默认false
        // tableTree: true, // 是否tree，属性表格，根据业务加上的
        tableKey: 'idCcNewsManage', // 主键，默认id
        tableOptWidth: '130px', // 表格操作宽度
        initSearch: true, // 初始化的时候，是否直接请求数据，
        showPagination: true, // 是否显示分页
        // 表格操作接口
        api: {
          list: () =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve({
                  content: tableData,
                  totalElements: 1
                })
              }, 3000)
            })
        },
        columns: [
          {
            type: 'select',
            label: '来源',
            prop: 'newsSource',
            optionLabel: 'name',
            optionValue: 'area_code',
            options: [],
            optionsGet: () =>
              new Promise(resolve => {
                resolve({
                  content: areaList
                })
              }),
            searchForm: true
          },
          {
            type: 'string',
            label: '排序',
            prop: 'newsSort'
          },
          {
            type: 'string',
            label: '标题',
            prop: 'newsTitle',
            searchForm: true,
            render: (h: CreateElement, params) => {
              return (
                <div
                  onClick={this.onShowDetail.bind(this, params.row)}
                  style={`color: #1EA1FF; text-decoration: underline;cursor: pointer;`}>
                  {params.row.newsTitle}
                </div>
              )
            }
          },
          {
            type: 'string',
            label: '标题',
            prop: 'newsTitle'
          },
          {
            type: 'string',
            label: '发布人',
            prop: 'newsPromulgator',
            searchForm: true
          },
          {
            type: 'string',
            label: '浏览量',
            prop: 'glanceNum'
          },
          {
            type: 'svg',
            label: '图标',
            prop: 'svg'
            // icons: icons
          },
          {
            type: 'datetime',
            label: '发布时间',
            prop: 'publishTime'
          },
          {
            type: 'datetime',
            label: '更新时间',
            prop: 'updateTime'
          },
          {
            type: 'datetime',
            label: '创建时间',
            prop: 'creatTime'
          },
          {
            type: 'select',
            label: '状态',
            prop: 'newsStatus',
            options: [
              { label: '已提交', value: '0' },
              { label: '已上架', value: '1' },
              { label: '已下架', value: '2' }
            ]
          },

          {
            type: 'select',
            label: '结构模式',
            prop: 'newsModel',
            searchForm: true,
            options: [
              {
                value: '1',
                label: '上下结构'
              },
              {
                value: '2',
                label: '左右结构'
              }
            ]
          },
          {
            type: 'upload',
            label: '封面图片',
            prop: 'fileIds'
          }
          // {
          //   tag: 'ml-editor', //'c-table',
          //   label: '新闻内容',
          //   prop: 'newsContent',
          //   block: true,
          //   showTable: false
          // }

          // {
          //   type: 'string',
          //   label: '图标名称',
          //   prop: 'icon',
          //   showTable: true, // 是否在表格中展示
          //    // 搜索时使用，默认false
          //   addForm: true, // 新增时使用，默认true
          //   editForm: true, // 编辑时使用，默认true
          //   viewForm: true, // 查看是使用，默认true
        ]
      }
    }
  }

  onShowDetail(row: TableData) {
    // this.$refs.mainTable.viewShow(row)
    console.log(row)
  }
}
</script>
<style lang="scss" scoped></style>

```

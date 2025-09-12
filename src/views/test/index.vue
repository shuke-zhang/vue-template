<script setup lang="ts">
import { ref } from 'vue'

interface R {
  id: number
  no: number
  score: number
  code: string
  gender: string
  age: string
  remark: string
}

const rows = ref<R[]>([
  { id: 1, no: 7, score: 99, code: '1006', gender: '男', age: '20岁', remark: '暂无' },
  { id: 2, no: 8, score: 96, code: '1007', gender: '女', age: '26岁', remark: '—' },
  { id: 3, no: 9, score: 97, code: '1008', gender: '男', age: '31岁', remark: '复查' },
])

function onSel() {}
function onDel(r: R) {
  console.log('del', r)
}
function onEdit(r: R) {
  console.log('edit', r)
}
function onPreview(r: R) {
  console.log('preview', r)
}

/* 标记整行与操作列，供样式选择 */
function rowClass() {
  return 'pill-row'
}
function cellClass({ column }: { column: any }) {
  if (column?.columnKey === 'op') {
    return 'op-cell'
  }
  return 'content-cell'
}
</script>

<template>
  <div class="page">
    <el-table
      :data="rows"
      style="width: 100%"
      :row-class-name="rowClass"
      :cell-class-name="cellClass"
      class="has-op"
      @selection-change="onSel"
    >
      <el-table-column type="selection" width="48" />
      <el-table-column prop="no" label="编号" width="90" align="center" />
      <el-table-column prop="score" label="分数" width="100" align="center" />
      <el-table-column prop="code" label="病例号" width="140" align="center" />
      <el-table-column prop="gender" label="性别" width="100" align="center" />
      <el-table-column prop="age" label="年龄" width="120" align="center" />
      <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />

      <el-table-column
        label="操作"
        width="220"
        fixed="right"
        column-key="op"
        class-name="op-col"
        label-class-name="op-col-header"
        align="center"
      >
        <template #default="{ row }">
          <el-button size="small" type="danger" plain @click="onDel(row)">
            删除
          </el-button>
          <el-button size="small" type="primary" plain @click="onEdit(row)">
            修改
          </el-button>
          <el-button size="small" plain @click="onPreview(row)">
            预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.page {
  padding: 12px;
  /* 操作列宽度变量，与 <el-table-column width="220"> 保持一致 */
  --op-w: 220px;
  /* 行间距（与 border-spacing 的垂直间距一致） */
  --row-gap-y: 10px;
}

/* 让表体使用“分隔布局”，产生行与行的垂直间隙 */
:deep(table.el-table__body) {
  border-collapse: separate !important;
  border-spacing: 0 var(--row-gap-y) !important;
}

/* 行容器用于承载 ::before 背景层 */
:deep(.el-table__body tr.pill-row) {
  position: relative;
  z-index: 0;
}

/* 用 ::before 一次性铺出“药丸”背景，右侧为操作列留白 */
:deep(.el-table__body tr.pill-row::before) {
  content: '';
  position: absolute;
  left: 0;
  right: var(--op-w);
  top: calc(var(--row-gap-y) / 2);
  bottom: calc(var(--row-gap-y) / 2);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--el-border-color);
  border-radius: 999px;
  pointer-events: none;
  z-index: -1;
}

/* 悬浮时的高亮与轻微浮起感 */
:deep(.el-table__body tr.pill-row:hover::before) {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 内容区的 td 不再各自画边框/圆角，交给 ::before 来统一渲染 */
:deep(tr.pill-row td.content-cell) {
  background: transparent;
  border: 0;
}

/* 药丸内部留白更像一条条带 */
:deep(tr.pill-row td.content-cell .cell) {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* —— 右侧“操作”列：独立隔离且粘附 —— */
:deep(td.op-cell) {
  position: sticky;
  right: 0;
  background: var(--el-bg-color);
  border-left: 2px solid var(--el-border-color);
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 2;
}

/* 操作列按钮布局与间距 */
:deep(td.op-cell .cell) {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
}

/* 表头对应处理，保持粘附与分隔线一致 */
:deep(th.op-col-header) {
  position: sticky;
  right: 0;
  z-index: 3;
  background: var(--el-bg-color);
  border-left: 2px solid var(--el-border-color);
}

/* 容器背景（按需） */
.page {
  background: transparent;
}

/* —— 可选：响应式调整操作列宽度，记得与列的 width 一致 —— */
/* @media (max-width: 1280px) {
  .has-op {
    --op-w: 200px;
  }
} */
</style>

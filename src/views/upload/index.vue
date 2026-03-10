<script setup lang="ts">
import type { UploadUserFile } from 'element-plus'
import type { UploadRow } from '@/components/uploadFile/types'

/**
 * =========================
 * drag 拖拽模式
 * =========================
 */
const dragFileData = ref<UploadUserFile[]>([])
const dragUploadedFiles = ref<UploadRow[] | null>([])

/**
 * =========================
 * list 列表模式
 * =========================
 */
const listFileData = ref<UploadUserFile[]>([])
const listUploadedFiles = ref<UploadRow[] | null>([])

/**
 * =========================
 * avatar 头像模式
 * =========================
 */
const avatarFileData = ref<UploadUserFile[]>([])
const avatarUploadedFiles = ref<UploadRow | null>(null)

/**
 * =========================
 * button 按钮模式
 * =========================
 */
const buttonFileData = ref<UploadUserFile[]>([])
const buttonUploadedFiles = ref<UploadRow[] | null>([])

/**
 * =========================
 * 通用：转数组，方便 el-table / v-for 展示
 * =========================
 */
function normalizeRows(value: UploadRow | UploadRow[] | null | undefined): UploadRow[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return [value]
}

/**
 * =========================
 * 事件输出
 * =========================
 */
function handleSuccess(file: UploadRow, mode: string): void {
  console.log(`[${mode}] success`, file)
}

function handleProgress(file: UploadRow, mode: string): void {
  console.log(`[${mode}] progress`, file)
}

function handleError(file: UploadRow, mode: string): void {
  console.log(`[${mode}] error`, file)
}

/**
 * =========================
 * 计算属性：统一给模板使用
 * =========================
 */
const dragRows = computed(() => {
  return normalizeRows(dragUploadedFiles.value)
})

const listRows = computed(() => {
  return normalizeRows(listUploadedFiles.value)
})

const avatarRows = computed(() => {
  return normalizeRows(avatarUploadedFiles.value)
})

const buttonRows = computed(() => {
  return normalizeRows(buttonUploadedFiles.value)
})
</script>

<template>
  <div class="p-[20px]">
    <el-card shadow="never">
      <template #header>
        <div class="text-[18px] font-bold">
          UploadFile 上传组件测试页
        </div>
      </template>

      <!-- ========================= -->
      <!-- drag 拖拽模式 -->
      <!-- ========================= -->
      <div class="section-block">
        <div class="section-title">
          1、拖拽模式 drag
        </div>
        <div class="section-desc">
          说明：该模式适合大面积拖拽上传场景，支持批量上传。下方单独展示每个文件的上传进度、状态、大小。
        </div>

        <div class="mt-[16px]">
          <UploadFile
            v-model:file-data="dragFileData"
            v-model:uploaded-files="dragUploadedFiles"
            mode="drag"
            action="/api/videoKC/video_upload2"
            :limit="9"
            height="220"
            width="100%"
            file-types="video"
            :max-size-m-b="500"
            @success="(row) => handleSuccess(row, 'drag')"
            @progress="(row) => handleProgress(row, 'drag')"
            @error="(row) => handleError(row, 'drag')"
          />
        </div>

        <div class="mt-[20px]">
          <div class="progress-title">
            拖拽模式上传进度
          </div>

          <el-table
            :data="dragRows"
            style="width: 100%"
            empty-text="暂无上传文件"
            border
          >
            <el-table-column label="文件名" min-width="240">
              <template #default="{ row }">
                <span class="truncate">
                  {{ row.name || '-' }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="进度" width="320">
              <template #default="{ row }">
                <el-progress
                  :key="row.uid"
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="Number(row.progress || 0)"
                  :status="row.status === 'fail' ? 'exception' : row.status === 'success' ? 'success' : undefined"
                />
              </template>
            </el-table-column>

            <el-table-column label="大小" width="120">
              <template #default="{ row }">
                {{ row.size || '-' }}
              </template>
            </el-table-column>

            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 'success' ? 'success' : row.status === 'fail' ? 'danger' : 'warning'"
                >
                  {{ row.status || '-' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="地址" min-width="260">
              <template #default="{ row }">
                <span class="truncate text-[#409EFF]">
                  {{ row.response?.data?.httpUrl || row.url || '-' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-divider content-position="left">
        列表模式
      </el-divider>

      <!-- ========================= -->
      <!-- list 列表模式 -->
      <!-- ========================= -->
      <div class="section-block">
        <div class="section-title">
          2、列表模式 list
        </div>
        <div class="section-desc">
          说明：该模式适合普通文件上传列表展示场景，支持缩略图、删除、预览，同时下方展示独立进度信息。
        </div>

        <div class="mt-[16px]">
          <UploadFile
            v-model:file-data="listFileData"
            v-model:uploaded-files="listUploadedFiles"
            mode="list"
            action="/api/videoKC/video_upload2"
            :limit="2"
            width="120"
            height="120"
            list-type="picture-card"
            file-types="video"
            :max-size-m-b="500"
            @success="(row) => handleSuccess(row, 'list')"
            @progress="(row) => handleProgress(row, 'list')"
            @error="(row) => handleError(row, 'list')"
          />
        </div>

        <div class="mt-[20px]">
          <div class="progress-title">
            列表模式上传进度
          </div>

          <el-table
            :data="listRows"
            style="width: 100%"
            empty-text="暂无上传文件"
            border
          >
            <el-table-column label="文件名" min-width="240">
              <template #default="{ row }">
                <span class="truncate">
                  {{ row.name || '-' }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="进度" width="320">
              <template #default="{ row }">
                <el-progress
                  :key="row.uid"
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="Number(row.progress || 0)"
                  :status="row.status === 'fail' ? 'exception' : row.status === 'success' ? 'success' : undefined"
                />
              </template>
            </el-table-column>

            <el-table-column label="大小" width="120">
              <template #default="{ row }">
                {{ row.size || '-' }}
              </template>
            </el-table-column>

            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 'success' ? 'success' : row.status === 'fail' ? 'danger' : 'warning'"
                >
                  {{ row.status || '-' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="地址" min-width="260">
              <template #default="{ row }">
                <span class="truncate text-[#409EFF]">
                  {{ row.response?.data?.httpUrl || row.url || '-' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-divider content-position="left">
        头像模式
      </el-divider>

      <!-- ========================= -->
      <!-- avatar 头像模式 -->
      <!-- ========================= -->
      <div class="section-block">
        <div class="section-title">
          3、头像模式 avatar
        </div>
        <div class="section-desc">
          说明：该模式固定单文件，适合头像、封面图、单图上传场景。上传后下方会展示当前唯一文件的进度信息。
        </div>

        <div class="mt-[16px] flex items-start gap-[20px]">
          <UploadFile
            v-model:file-data="avatarFileData"
            v-model:uploaded-files="avatarUploadedFiles"
            mode="avatar"
            :limit="1"
            action="/api/videoKC/video_upload2"
            width="120"
            height="120"
            file-types="image"
            :max-size-m-b="20"
            @success="(row) => handleSuccess(row, 'avatar')"
            @progress="(row) => handleProgress(row, 'avatar')"
            @error="(row) => handleError(row, 'avatar')"
          />

          <div class="flex-1">
            <div class="progress-title">
              头像模式上传进度
            </div>

            <el-table
              :data="avatarRows"
              style="width: 100%"
              empty-text="暂无上传文件"
              border
            >
              <el-table-column label="文件名" min-width="240">
                <template #default="{ row }">
                  <span class="truncate">
                    {{ row.name || '-' }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="进度" width="320">
                <template #default="{ row }">
                  <el-progress
                    :key="row.uid"
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="Number(row.progress || 0)"
                    :status="row.status === 'fail' ? 'exception' : row.status === 'success' ? 'success' : undefined"
                  />
                </template>
              </el-table-column>

              <el-table-column label="大小" width="120">
                <template #default="{ row }">
                  {{ row.size || '-' }}
                </template>
              </el-table-column>

              <el-table-column label="状态" width="120">
                <template #default="{ row }">
                  <el-tag
                    :type="row.status === 'success' ? 'success' : row.status === 'fail' ? 'danger' : 'warning'"
                  >
                    {{ row.status || '-' }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column label="地址" min-width="260">
                <template #default="{ row }">
                  <span class="truncate text-[#409EFF]">
                    {{ row.response?.data?.httpUrl || row.url || '-' }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <el-divider content-position="left">
        按钮模式
      </el-divider>

      <!-- ========================= -->
      <!-- button 按钮模式 -->
      <!-- ========================= -->
      <div class="section-block">
        <div class="section-title">
          4、按钮模式 button
        </div>
        <div class="section-desc">
          说明：该模式只有一个上传按钮，适合表单中作为附件上传入口使用。文件进度和状态在下方单独展示。
        </div>

        <div class="mt-[16px]">
          <UploadFile
            v-model:file-data="buttonFileData"
            v-model:uploaded-files="buttonUploadedFiles"
            mode="button"
            action="/api/videoKC/video_upload2"
            :limit="5"
            file-types="video"
            :max-size-m-b="500"
            @success="(row) => handleSuccess(row, 'button')"
            @progress="(row) => handleProgress(row, 'button')"
            @error="(row) => handleError(row, 'button')"
          >
            <template #button>
              <el-button type="primary">
                选择视频文件
              </el-button>
            </template>
          </UploadFile>
        </div>

        <div class="mt-[20px]">
          <div class="progress-title">
            按钮模式上传进度
          </div>

          <el-table
            :data="buttonRows"
            style="width: 100%"
            empty-text="暂无上传文件"
            border
          >
            <el-table-column label="文件名" min-width="240">
              <template #default="{ row }">
                <span class="truncate">
                  {{ row.name || '-' }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="进度" width="320">
              <template #default="{ row }">
                <el-progress
                  :key="row.uid"
                  :text-inside="true"
                  :stroke-width="18"
                  :percentage="Number(row.progress || 0)"
                  :status="row.status === 'fail' ? 'exception' : row.status === 'success' ? 'success' : undefined"
                />
              </template>
            </el-table-column>

            <el-table-column label="大小" width="120">
              <template #default="{ row }">
                {{ row.size || '-' }}
              </template>
            </el-table-column>

            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 'success' ? 'success' : row.status === 'fail' ? 'danger' : 'warning'"
                >
                  {{ row.status || '-' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="地址" min-width="260">
              <template #default="{ row }">
                <span class="truncate text-[#409EFF]">
                  {{ row.response?.data?.httpUrl || row.url || '-' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.section-block {
  margin-bottom: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-desc {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
  line-height: 22px;
}

.progress-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #606266;
}

.truncate {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

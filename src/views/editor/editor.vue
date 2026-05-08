<script setup lang="ts">
import type { IDomEditor, IToolbarConfig } from '@wangeditor-next/editor'
import { DomEditor } from '@wangeditor-next/editor'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import '@wangeditor-next/editor/dist/css/style.css'

// 编辑器实例
const editorRef = shallowRef<IDomEditor>()

// 内容
const valueHtml = defineModel({
  required: true,
  type: String,
})

// 模式
const mode = 'default'

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-image', 'group-video', 'codeBlock'],
}

// editor 配置
const editorConfig = {
  placeholder: '请输入内容...',

}

// ==========================
// 生命周期
// ==========================

onMounted(() => {
  const editor = editorRef.value
  console.log(editor, '当前菜单')

  if (!editor)
    return

  const toolbar = DomEditor.getToolbar(editor)
  console.log(toolbar, '当前菜单')

  if (!toolbar)
    return

  const curToolbarConfig = toolbar.getConfig()
  console.log(curToolbarConfig.toolbarKeys, '当前菜单')
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (!editor)
    return

  editor.destroy()
})

// ==========================
// 编辑器事件
// ==========================

function handleCreated(editor: IDomEditor) {
  console.log('created', editor)
  editorRef.value = editor
}

function handleChange(editor: IDomEditor) {
  console.log('change:', editor.getHtml())
}

function handleDestroyed(editor: IDomEditor) {
  console.log('destroyed', editor)
}

function handleFocus(editor: IDomEditor) {
  console.log('focus', editor)
}

function handleBlur(editor: IDomEditor) {
  console.log('blur', editor)
}

function customAlert(info: string, type: string) {
  console.log(`【自定义提示】${type} - ${info}`)
}

function _customPaste(editor: IDomEditor, event: ClipboardEvent, callback: (result: boolean) => void) {
  console.log('ClipboardEvent', event)

  editor.insertText('xxx')

  callback(false)
}

// ==========================
// 操作函数
// ==========================

function _insertText() {
  const editor = editorRef.value
  if (!editor)
    return

  editor.insertText('hello world')
}

function _printHtml() {
  const editor = editorRef.value
  if (!editor)
    return

  console.log(editor.getHtml())
}

function _disable() {
  const editor = editorRef.value
  if (!editor)
    return

  editor.disable()
}
</script>

<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar
        :editor="editorRef"
        :default-config="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />

      <Editor
        v-model="valueHtml"
        :default-config="editorConfig"
        :mode="mode"
        style="height: 180px; overflow-y: hidden"
        @on-created="handleCreated"
        @on-change="handleChange"
        @on-destroyed="handleDestroyed"
        @on-focus="handleFocus"
        @on-blur="handleBlur"
        @custom-alert="customAlert"
      />
    </div>
  </div>
</template>

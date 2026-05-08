<script setup lang="ts">
import type { ComponentInstance, ComponentPublicInstance } from 'vue'
import { ElButton } from 'element-plus'
import { h } from 'vue'

const vm = getCurrentInstance()
function changeRef(exposed: Element | ComponentPublicInstance | null) {
  if (!vm?.exposed)
    return
  Object.assign(vm.exposed, exposed)
}

defineExpose({} as ComponentInstance<typeof ElButton>)
</script>

<template>
  <div>
    <component
      :is="h(ElButton, {
        ...$attrs,
        ref: changeRef,
        class: [
          'shuke-btn',
          $attrs.size === 'large' ? 'shuke-btn--large' : '',
        ],
      }, $slots)"
    />
  </div>
</template>

<style scoped lang="scss">
.shuke-btn {
  background-image: url('/src/assets/theme/btn-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 25.5px;
  color: #7946c7;
}
.shuke-btn--large {
  width: 240px !important;
  height: 52px !important;
  line-height: 52px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>

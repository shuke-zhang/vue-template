<script setup lang="ts">
import type { IconFontType } from './iconfont';
import { computed } from 'vue';

/**
 * - 使用示例 <icon-font name="a-lujing1" size="43" color="#7c91fc" />
 * - 注意 ， 使用阿里巴巴图标库中项目设置里面请务必勾选上 WOFF2、WOFF、TTF 暂未测试是否对字体图标有影响
 */
const props = defineProps({
  name: {
    type: String as PropType<IconFontType>,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '16',
  },
});

const iconName = computed(() => `#icon-${props.name}`);
const svgClass = computed(() => {
  if (props.className) {
    return `icon-font ${props.className}`;
  }
  return 'icon-font';
});

const iconSize = computed(() => `${props.size || 16}px`);

// 计算最终的颜色：如果没有传入颜色，则返回 'currentColor'
const iconFillColor = computed(() => {
  return props.color || 'currentColor';
});
</script>

<template>
  <svg :class="svgClass" aria-hidden="true" :style="{ width: iconSize, height: iconSize }">
    <use :xlink:href="iconName" :fill="iconFillColor" />
  </svg>
</template>

<style scoped lang="scss">
@import './iconfont.css';
.icon-font {
  position: relative;
  vertical-align: -2px;
}

.no-color {
  fill: none !important; // 当不想要颜色时，使用 'none'
}
</style>

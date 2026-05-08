import type { SlateDescendant } from '@wangeditor-next/editor'
import { SlateElement, SlateText } from '@wangeditor-next/editor'

declare module '@wangeditor-next/editor' {
  // 扩展 Text
  interface SlateText {
    text: string
  }

  // 扩展 Element
  interface SlateElement {
    type: string
    children: SlateDescendant[]
  }
}

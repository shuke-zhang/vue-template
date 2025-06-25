import type { ElMessageBoxOptions } from 'element-plus';

import { ElMessageBox } from 'element-plus';

type ConfirmType = Required<ElMessageBoxOptions>['type'];
type MessageOptionsSimple = Omit<ElMessageBoxOptions, 'type' | 'message' | 'title'>;

export function createBaseConfirm(type: ConfirmType, _options: MessageOptionsSimple = {}) {
  const defaultOptions: MessageOptionsSimple = {
    showCancelButton: true,
    showConfirmButton: true,
    showClose: false,
    closeOnClickModal: false,
    closeOnHashChange: false,
    closeOnPressEscape: false,
    ..._options,
  };
  return (message: string, title = '提示', options: MessageOptionsSimple = {}) => {
    return ElMessageBox({
      title,
      message,
      type,
      ...defaultOptions,
      ...options,
    });
  };
}
import type { NotificationOptions } from 'element-plus';

import { ElNotification } from 'element-plus';

type ModelType = Required<NotificationOptions>['type'];
type NotificationOptionsWithoutTypeAndMessage = Partial<Omit<NotificationOptions, 'type' | 'message'>>;

export function createBaseModal(type: ModelType, options: NotificationOptionsWithoutTypeAndMessage = {}) {
  const defaultOptions: NotificationOptionsWithoutTypeAndMessage = {
    duration: 2000,
    ...options,
  };

  return (message: string, title = '提示', options: NotificationOptionsWithoutTypeAndMessage = {}) => {
    return ElNotification({
      type,
      title,
      message,
      ...defaultOptions,
      ...options,
    });
  };
}
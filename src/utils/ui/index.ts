import { createBaseConfirm } from './confirm';
import { createBaseMessage } from './message';
import { createBaseModal } from './modal';

// Message
export const showMessageSuccess = createBaseMessage('success');
export const showMessageError = createBaseMessage('error');
export const showMessageInfo = createBaseMessage('info');
export const showMessageWarning = createBaseMessage('warning');

// Confirm
export const confirmSuccess = createBaseConfirm('success');
export const confirmError = createBaseConfirm('error');
export const confirmInfo = createBaseConfirm('info');
export const confirmWarning = createBaseConfirm('warning');

// Alert
export const alertSuccess = createBaseConfirm('success', { showCancelButton: false });
export const alertError = createBaseConfirm('error', { showCancelButton: false });
export const alertInfo = createBaseConfirm('info', { showCancelButton: false });
export const alertWarning = createBaseConfirm('warning', { showCancelButton: false });

// Modal
export const modalSuccess = createBaseModal('success');
export const modalError = createBaseModal('error');
export const modalInfo = createBaseModal('info');
export const modalWarning = createBaseModal('warning');

// Simple toast utility that dispatches window events instead of native alerts
export const toast = {
  success: (msg) => {
    console.log('✓ Success:', msg);
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { type: 'success', message: msg } }));
  },
  error: (msg) => {
    console.error('✗ Error:', msg);
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { type: 'error', message: msg } }));
  },
  info: (msg) => {
    console.info('ℹ Info:', msg);
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { type: 'info', message: msg } }));
  },
  warning: (msg) => {
    console.warn('⚠ Warning:', msg);
    window.dispatchEvent(new CustomEvent('custom-toast', { detail: { type: 'warning', message: msg } }));
  }
};

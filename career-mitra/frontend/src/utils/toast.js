// Simple toast utility that uses alerts instead of react-toastify
export const toast = {
  success: (msg) => {
    console.log('✓ Success:', msg);
    alert('✓ ' + msg);
  },
  error: (msg) => {
    console.error('✗ Error:', msg);
    alert('✗ Error: ' + msg);
  },
  info: (msg) => {
    console.info('ℹ Info:', msg);
    alert('ℹ ' + msg);
  },
  warning: (msg) => {
    console.warn('⚠ Warning:', msg);
    alert('⚠ ' + msg);
  }
};

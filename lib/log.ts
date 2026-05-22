export function log(...args: any[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[LOG]', ...args);
  }
}

export function errorLog(...args: any[]) {
  console.error('[ERROR]', ...args);
}

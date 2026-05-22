/**
 * Format large numbers to human-readable format
 * Example: 1200 → "1.2K", 15000 → "15K", 1000000 → "1M"
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Animate counter from start to end value
 * Returns an interval ID that should be cleared when done
 */
export function animateCounter(
  startValue: number,
  endValue: number,
  duration: number = 1000,
  callback: (value: number) => void
): NodeJS.Timeout {
  const startTime = Date.now();
  
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuad);
    
    callback(currentValue);
    
    if (progress === 1) {
      clearInterval(interval);
    }
  }, 16); // ~60 FPS
  
  return interval;
}

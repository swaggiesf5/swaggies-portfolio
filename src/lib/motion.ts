/** Read once at boot, same as the original (it doesn't react to the setting changing mid-visit). */
export const prefersReducedMotion = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Company projects before personal ones (no `type` counts as personal), most
 * recent first within each; entries without a startDate sink to the end.
 */
export const compareProjects = (a: { type?: string; startDate?: number }, b: { type?: string; startDate?: number }) =>
  Number(a.type !== 'company') - Number(b.type !== 'company') || (b.startDate || 0) - (a.startDate || 0)

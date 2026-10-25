/**
 * @file Overrides Nuxt UI's `<UBadge>` outline-variant colors (which come
 * from its own `--ui-*` palette, never the `--theme-*` CSS custom
 * properties) with `--theme-accent`, so a badge follows the active
 * theme/Dracula editor-scope like everything else inside `<ThemePanel>`.
 * The `base` slot class is merged last via tailwind-merge, so it wins over
 * the default `text-primary`/`ring-primary/50`.
 * Shared by `projects/Index.vue`'s tech badges and `github/part/Item.vue`'s
 * topic badges - previously two identical copies of this same object.
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */
export const accentBadgeUi = {
  base: 'text-theme-accent ring-1 ring-inset ring-theme-accent/40',
}

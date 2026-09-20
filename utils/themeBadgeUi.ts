/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Overrides Nuxt UI's `<UBadge>` default `{color}` variant
 * (which never picks up the `--theme-*` CSS custom properties) with
 * `--theme-accent`, so a badge follows the active theme/Dracula editor-
 * scope like everything else inside `<ThemePanel>`. Nuxt UI's `ui` prop
 * merges via tailwind-merge per class-modifier group, so the `dark:`
 * variant needs its own explicit override too, or the default
 * `dark:text-{color}-400`/`dark:ring-{color}-400` classes survive.
 * Shared by `projects/Index.vue`'s tech badges and `github/part/Item.vue`'s
 * topic badges - previously two identical copies of this same object.
 */
export const accentBadgeUi = {
  variant: {
    outline: 'text-theme-accent dark:text-theme-accent ring-1 ring-inset ring-theme-accent/40 dark:ring-theme-accent/40',
  },
}

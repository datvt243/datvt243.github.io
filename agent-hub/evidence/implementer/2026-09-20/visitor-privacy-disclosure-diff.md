# 2026-09-20 — visitor-privacy-disclosure (implementer diff)

## Diff

```diff
--- a/themes/portfolio-dev/layout/Footer.vue
+++ b/themes/portfolio-dev/layout/Footer.vue
@@ -19,6 +19,8 @@
           ...
           <span class="hidden md:inline text-theme-faint">&middot;</span>
           <span class="hidden md:inline">&copy; {{ currentYear }} datvt243</span>
+          <span class="hidden lg:inline text-theme-faint">&middot;</span>
+          <span class="hidden lg:inline text-theme-faint">{{ t('footer.visitDisclosure') }}</span>
         </div>

--- a/i18n/locales/en.json
+++ b/i18n/locales/en.json
@@ -9,3 +9,4 @@
   "footer": {
-    "findMeIn": "find me in:"
+    "findMeIn": "find me in:",
+    "visitDisclosure": "Visits are logged (IP/location) for the owner's own analytics"
   },

--- a/i18n/locales/vi.json
+++ b/i18n/locales/vi.json
@@ -9,3 +9,4 @@
   "footer": {
-    "findMeIn": "Tìm mình ở:"
+    "findMeIn": "Tìm mình ở:",
+    "visitDisclosure": "Lượt truy cập (IP/vị trí) được ghi lại phục vụ thống kê của chủ trang"
   },
```

Placed behind `hidden lg:inline` (same visibility tier as the existing
copyright span) rather than always-visible: the footer is a thin single-
row status bar (`PROJECT.md`'s theme is an editor-style tab-bar look) with
no room to always show 3 separate clauses on narrower viewports without
wrapping/crowding the existing social icons and GitHub link. Desktop
visitors (the CDP-verified viewport) see it plainly; mobile/tablet keeps
the bar uncluttered, consistent with how `&copy; {{ currentYear }}
datvt243` itself is already `hidden md:inline`.

## Verification

- `npm run build`: clean.
- `npm run lint` (Node 24): `✖ 30 problems (0 errors, 30 warnings)` —
  exact baseline match.
- Real dev server, `curl http://localhost:4011/` raw HTML footer contains
  the real rendered Vietnamese string (default locale, `vi`):
  `Lượt truy cập (IP/vị trí) được ghi lại phục vụ thống kê của chủ trang`.
- Chrome CDP: real page load + `footer.textContent` confirmed the string
  renders in the actual DOM (not just the SSR payload), `0` console
  errors on the same pass that also verified the SEO-metadata fix.

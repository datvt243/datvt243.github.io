# 2026-09-07 - cleanup-pdf-only-types (diff)

Worker: implementer
Node: `cleanup-pdf-only-types`
Task: `/todo #142`

## Modified file

```diff
diff --git a/types/resume-document.ts b/types/resume-document.ts
index a468f6d..039f0ed 100644
--- a/types/resume-document.ts
+++ b/types/resume-document.ts
@@ -121,6 +121,11 @@ export interface Reference {
   position: string
 }
 
+// `link`/`images` intentionally dropped (issue #142): `server/utils/
+// createPDF.ts` is the only consumer of this type anywhere in the repo
+// (`grep -rn "\bCertificate\b"` confirms) and never reads either field
+// (`grep -n "\.link\b\|\.images\b" createPDF.ts`: 0 matches) — dead type
+// surface, not a behavior change (interfaces have no runtime footprint).
 export interface Certificate {
   name: string
   organization: string
@@ -128,15 +133,13 @@ export interface Certificate {
   startDate: number
   endDate: number
   isNoExpiration: boolean
-  link?: string
-  images?: string[]
 }
 
+// `link`/`images` dropped for the same reason as `Certificate` above
+// (issue #142) — `createPDF.ts` never reads either field.
 export interface Award {
   name: string
   organization: string
   issueDate: number
-  link?: string
-  images?: string[]
   description?: string
 }
```

`Item` and `Reference` interfaces (also in this file): untouched — review
confirmed 100% of their fields are used by `server/utils/createPDF.ts`.

## Review commands run (cited in the plan note)
```
$ grep -rn "\bItem\b\|\bReference\b\|\bCertificate\b\|\bAward\b" <repo, excl. node_modules/.nuxt/agent-hub>
types/resume-document.ts:108:export interface Item {
types/resume-document.ts:117:export interface Reference {
types/resume-document.ts:124:export interface Certificate {
types/resume-document.ts:135:export interface Award {
server/utils/createPDF.ts:6:  Item,
server/utils/createPDF.ts:7:  Reference,
server/utils/createPDF.ts:8:  Certificate,
server/utils/createPDF.ts:9:  Award,
server/utils/createPDF.ts:126:  const _layoutItem = (props: Item) => {
server/utils/createPDF.ts:333:    renderReferences: function (list: Reference[]) {
server/utils/createPDF.ts:339:    .map((e: Reference) => {
server/utils/createPDF.ts:353:    renderCertificates: function (list: Certificate[]) {
server/utils/createPDF.ts:357:        .map((el: Certificate) => {
server/utils/createPDF.ts:372:    renderAwards: function (list: Award[]) {
server/utils/createPDF.ts:376:        .map((el: Award) => {

$ grep -n "\.link\b\|\.images\b\|link,\|images,\|link:\|images:" server/utils/createPDF.ts
(0 matches)
```

## Scope check
`git status --short` at end of this pass (this node's portion only):
```
 M agent-hub/haven/diagrams/dev-loop.prime-mermaid.md
 M types/resume-document.ts
?? agent-hub/evidence/implementer/2026-09-07/cleanup-pdf-only-types-{plan,diff}.md
```
Exactly the 1 code file + the diagram row + this node's own evidence
notes — nothing else touched. (Other unrelated files remain modified/
untracked in the working tree from the earlier `blog-api-runtime-
validation` node this same session — not part of this node's diff.)

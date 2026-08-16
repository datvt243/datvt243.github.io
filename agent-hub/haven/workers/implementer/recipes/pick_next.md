# Contract
- Input: `{task: string}`
- Output: `{node, diagram, current_state, acceptance: string[],
  files: string[], blocked_by: string|null}`

## Steps
1. Đọc `NORTHSTAR.md` + root `CLAUDE.md` (project thật) + `doctrine/MEMORY.md`
   + `doctrine/domains/PROJECT.md`.
2. Đọc MỌI diagram trong `haven/diagrams/`, lập danh sách node + PM status.
3. Tìm node PENDING sớm nhất trên critical path.
4. Không match → không tự bịa việc; báo rõ "không có node PENDING", dừng.
5. Định vị code anchors bằng grep — path thật trong repo Nuxt (`pages/`,
   `themes/<ACTIVE_THEME>/`, `server/api/`, `components/`, `stores/`...),
   không tự bịa.
6. Khai báo blockers nếu cần env var (`.env.example` liệt kê:
   `MY_EMAIL`, `NODE_API`, `GITHUB_TOKEN`, `GITHUB_USER`,
   `PUPPETEER_EXECUTABLE_PATH`) chưa có sẵn.
7. Evidence: viết `evidence/implementer/<date>/<slug>-plan.md`.

## Hard rules honored
`NodeBeforeCode` | `EvidencePerAction` | `NoSilentFailure`

## Failure branches
| Failure | Handling |
|---|---|
| Chưa có diagram nào khớp | Tạo node mới trên `haven/diagrams/dev-loop.prime-mermaid.md`, giữ đúng format ratchet LAI-13 |
| Task mơ hồ | Dừng và hỏi, không đoán |
| Task đòi hỏi env var chưa set (vd `PUPPETEER_EXECUTABLE_PATH` cho PDF) | Báo `blocked`, không giả lập giá trị |

## Runtime
`/worker implementer "<task>"` hoặc là lượt 1 của `/todo "<task>"`. Không API
key, không network call ngoài repo — Claude Code LÀ runtime.

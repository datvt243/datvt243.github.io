# doctrine/MEMORY.md ★ (authority cao nhất — Authority: 65537)

> Nếu bất kỳ tài liệu nào khác mâu thuẫn với file này về path hoặc lệnh,
> FILE NÀY THẮNG. One home per fact — một lệnh sống ở hai file sẽ sai ở một
> trong hai.

## What this is
- Hub path (absolute): `/Users/_david/Workspace/Project/datvt243.github.io/agent-hub`
- Code repo path (absolute): `/Users/_david/Workspace/Project/datvt243.github.io`
- Quan hệ hub ↔ repo: hub nằm NGAY TRONG repo (không phải 2 repo tách biệt).
  Vẫn chỉ đối chiếu repo qua worker, có build/lint run thật + evidence note —
  không bao giờ ad-hoc.

## The exact commands
> COPY these — never type them from memory. Lệnh nhớ trong đầu sẽ trôi, và
> lệnh trôi thì chứng minh sai thứ.

| Purpose | Command | Run from |
|---|---|---|
| Test | **KHÔNG CÓ** — project không có automated test suite (không có `test` script trong `package.json`) | — |
| Build (SSR) | `npm run build` | repo root |
| Build (static) | `npm run generate` | repo root |
| Lint (check) | `npm run lint` | repo root |
| Lint (autofix) | `npm run lint:fix` | repo root |
| Run locally | `npm run dev` | repo root |
| Preview build | `npm run preview` | repo root |

**"Verify" thay cho test suite**: `npm run build` phải sạch (0 lỗi) + `npm
run lint` phải sạch, VÀ nếu thay đổi có phần visual/behavior người dùng thấy
được, phải kiểm tra UI thật qua Chrome CDP (xem `domains/PROJECT.md` mục
"Browser verification"). Không có test nào để "pass" — đừng bao giờ claim
"tests pass".

## Stack
| Thing | Value |
|---|---|
| Language/runtime | TypeScript, Node — Nuxt 3 / Vue 3 SSR |
| Package manager | npm (`package-lock.json` có mặt) |
| Test runner | Không có |
| CSS | TailwindCSS v3 + `@nuxt/ui` v2 + sass |
| State | Pinia (`stores/`) |

## The default way to work
`/boot` → `/worker implementer "<task>"` → `/worker verifier "<task>"` (hoặc
gộp `/todo "<task>"`). Không bao giờ bỏ bước `/boot` ở phiên nguội, không
bao giờ bỏ bước build+lint thật trước khi báo `sealed_pending_verifier`.

## Workers
| wid | Role | Actions | Seal actions |
|---|---|---|---|
| implementer | Implementer | pick_next, implement | — |
| verifier | Verifier | verify_seal | SEAL, REOPEN |

## Forbidden states
5 state — xem chi tiết ở `agent-hub/CLAUDE.md`. Các state này OVERRIDE mọi
skill text khác.

## Facts that are always true
- Không có LLM API key ở đâu trong hub — Claude Code LÀ runtime.
- `haven/` là memory, không phải code.
- `evidence/` được commit; note "xấu" vẫn được giữ lại.
- Ratchet đơn điệu: PENDING → IN_PROGRESS → SEALED, không bao giờ lùi.
- Verifier sở hữu PM status; implementer không bao giờ tự đặt.
- Repo có root `CLAUDE.md` riêng (project thật: stack/architecture/env vars)
  — đọc file đó TRƯỚC `doctrine/domains/PROJECT.md`, không lặp lại nội dung
  của nó ở đây.
- Git workflow thật của repo (branch naming, never push to `main`, PR flow)
  sống ở `domains/PROJECT.md`, không phải ở đây — đây chỉ là path/lệnh.

## Open <<FILL>> values
Không còn `<<FILL>>` nào — mọi lệnh ở trên đã xác nhận từ `package.json` +
root `CLAUDE.md` thật, không đoán.

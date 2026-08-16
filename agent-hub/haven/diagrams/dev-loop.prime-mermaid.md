<!-- Diagram: dev-loop -->
<!-- Dev loop: plan - implement - verify - seal -->
DNA: 'smallest_diff / edit_x_read_back_proof_x_independent_verdict'
Auth: 65537 | Version: 1.0.0
Law: LAI-13 - monotonic ratchet (PENDING -> IN_PROGRESS -> SEALED, never demote)

> Mọi thay đổi tới repo code đi vào đây và đi ra bằng SEALED hoặc REOPENED —
> không có trạng thái nào khác ở giữa.

```mermaid
flowchart TD
    task[Task] --> pick[implementer: pick_next]
    pick --> exist{Node tồn tại trên diagram?}
    exist -- no --> draft[DRAFT node<br/>diagram-first: no node, no code]
    draft --> pick
    exist -- yes --> impl[implementer: implement<br/>diff nhỏ nhất]
    impl --> outward{Chạm outward-facing?}
    outward -- yes --> gate[SEAL GATE<br/>show diff, chờ approval]
    gate --> build
    outward -- no --> build[npm run build + npm run lint<br/>từ doctrine/MEMORY.md]
    build --> visual{Đổi visual/behavior?}
    visual -- yes --> cdp[Kiểm UI thật qua Chrome CDP :9888]
    visual -- no --> readback
    cdp --> readback{Output đã đọc lại<br/>nguyên văn chưa?}
    readback -- no --> unverified[EDIT_UNVERIFIED]
    unverified --> impl
    readback -- yes --> evidence[Ghi evidence note]
    evidence --> verifier[verifier: verify_seal]
    verifier --> verdict{Đạt mọi<br/>acceptance criteria?}
    verdict -- no --> reopen[REOPEN + lý do cụ thể]
    reopen --> impl
    verdict -- yes --> seal[SEAL<br/>cập nhật PM status]

    classDef gate fill:#f5c518,color:#000
    classDef bad fill:#e05555,color:#fff
    classDef good fill:#2fa84f,color:#fff
    class gate gate
    class unverified,reopen bad
    class seal good
```

## PM status
| Node | State | Notes |
|---|---|---|
| `light-theme-elevation` | SEALED | Light mode: `--theme-canvas` → trắng thuần; `ThemeHeader`/`ThemeFooter` giữ `bg-theme-panel` (`248 250 252`); `ThemePanel` (editor) có `--theme-editor` (`226 232 240`) riêng + `shadow-md` để nổi trội hơn. Verified: `npm run build`/`npm run lint` sạch + Chrome CDP computed style. Evidence: `evidence/implementer/2026-08-16/light-theme-elevation-{plan,diff}.md`, `evidence/verifier/2026-08-16/light-theme-elevation-seal.md`. |
| `centralize-color-tokens` | SEALED | Gom nơi khai báo mã màu vào 1 chỗ dễ tìm/dễ sửa: đổi tên `themes/portfolio-dev/tokens/` → `themes/portfolio-dev/settings-colors-theme/` (giữ nguyên `dark.css`/`light.css`, giữ format RGB triplet vì `<alpha-value>` opacity modifier cần nó). Verified: build/lint sạch + grep trực tiếp trên CSS đã build. Evidence: `evidence/implementer/2026-08-16/centralize-color-tokens-{plan,diff}.md`, `evidence/verifier/2026-08-16/centralize-color-tokens-seal.md`. |

Any regression phải là **node mới** (LAI-13) — không được sửa trực tiếp PM
status của node cũ để "gỡ" một SEAL đã có.

---
name: todo
description: Resolve/tạo GitHub issue + checkout branch riêng, rồi gộp /worker implementer + /worker verifier thành 1 lệnh cho agent-hub của datvt243.github.io — vẫn chạy 2 lượt tách biệt bên trong (không phá vỡ NeverVerifyOwnWork), tự lặp lại lượt implementer khi REOPEN tới giới hạn retry. Trigger: /todo "<task>"|#<issue-number> [--ship]. Dừng ở SEAL hoặc hết giới hạn retry, không tự commit — trừ khi có --ship, khi đó gọi tiếp /ship (vẫn qua đúng seal gate của /ship, giống hệt gọi tay).
argument-hint: "<task>"|#<issue-number> [--ship]
---

# /todo "<task>"|#<issue-number> [--ship]

Orchestrator thuần — KHÔNG tự triển khai lại logic implement/verify riêng.
Gọi lại đúng `worker` skill (`.claude/skills/worker/SKILL.md`) 2 lần, ở 2
lượt tách biệt.

## Steps
1. **[thêm 2026-09-12] Resolve issue + checkout branch** (chạy TRƯỚC mọi
   lệnh worker):
   1. **Resolve issue**:
      - Arg khớp `^#?\d+$` (issue mode) → `gh issue view <number> --json
        number,title,url`. Không tìm thấy / `gh` chưa auth → dừng, báo lỗi
        thật verbatim, không tự đoán tiếp.
      - Ngược lại (free-text mode) → `gh issue create --title "<dòng đầu
        của task, rút gọn>" --body "<toàn bộ task text>"` để mở issue mới,
        lấy `<number>`/`<title>`/`<url>` từ output thật của lệnh. Lỗi (không
        có `gh`, chưa auth, chưa cấu hình remote) → dừng, báo lỗi — không
        bao giờ chạy tiếp mà thiếu issue.
      - Từ đây, `<task>` cho phần còn lại của lượt `/todo` này là title +
        body của issue vừa resolve (đủ context cho implementer/verifier),
        không chỉ là arg gốc gõ vào.
   2. **Tính tên branch**: `<number>-<slug>`, `<slug>` = 3 từ đầu của issue
      title, viết thường, ký tự không phải chữ/số gộp thành `-`. VD issue
      #42 "Fix login redirect loop" → `42-fix-login-redirect`.
   3. **Resolve base branch**: đọc `doctrine/domains/PROJECT.md` (git
      workflow của project: `staging` là nhánh tích hợp, `main` chỉ nhận
      code qua `/release`) — base branch mặc định là `staging`, không bao
      giờ `main`. Không rõ → dừng, hỏi lại, không tự đoán.
   4. **Sync base branch thật sự trước khi nhánh ra từ nó**: `git fetch
      origin`, `git checkout <base>`, `git pull origin <base>` — luôn làm
      trước khi tạo branch mới, để cả branch mới lẫn điểm bắt đầu của
      implementer đều từ code mới nhất, không phải bản local cũ. Lỗi pull/
      conflict → dừng, báo lỗi thật verbatim, không bao giờ tự
      force/stash/discard thay operator.
   5. **Checkout branch của issue**: `gh issue develop <number> --list`
      trước — nếu đã có branch link sẵn (đang làm tiếp việc cũ) → checkout
      branch đó, `git pull` thêm (lấy update remote nếu có), không tạo
      branch thứ 2 cho cùng issue. Nếu chưa có → `gh issue develop <number>
      --checkout --base <base> --name <number>-<slug>` — tạo branch từ base
      vừa sync ở bước 4, link vào issue trên GitHub, và checkout, trong 1
      lệnh thật. Lỗi git-level (dirty tree, base ref không tồn tại...) →
      dừng, báo lỗi thật verbatim, không tự force/stash/discard thay
      operator.
   6. **Báo cáo** issue đã resolve (`#<number>`, URL) và tên branch cho
      operator trước khi tiếp tục — đây là báo cáo, KHÔNG phải gate phê
      duyệt thứ 2; gate phê duyệt thật duy nhất trong cả chuỗi `/todo` vẫn
      là bước push của `/ship` ở cuối.
2. **Lượt 1 — implementer**: chạy đúng quy trình `/worker implementer
   "<task>"` (load bundle → become → pick_next → implement → build+lint
   thật → evidence note), đã đứng trên branch từ bước 1. Dừng ở
   `sealed_pending_verifier`.
   - `blocked`/`failed` → dừng ngay, báo operator, không chạy lượt 2.
     `--ship` không kích hoạt (chưa SEAL).
3. **Lượt 2 — verifier**: chạy đúng quy trình `/worker verifier "<task>"`
   như một lượt HOÀN TOÀN RIÊNG — không mang theo suy luận/context của lượt
   1 vào phán quyết, chỉ đọc evidence note vừa ghi (`NeverVerifyOwnWork`
   vẫn áp dụng dù cùng 1 lệnh `/todo` gọi cả hai).
4. **Nếu REOPEN**: tự động quay lại bước 2 với đúng lý do REOPEN từ evidence
   note của verifier, tối đa **3 lần lặp**. Issue/branch từ bước 1 giữ
   nguyên xuyên suốt các lần REOPEN, không resolve lại. Chạm giới hạn →
   dừng, báo cáo toàn bộ lịch sử REOPEN cho operator tự quyết, không lặp vô
   hạn. `--ship` không kích hoạt (chưa SEAL).
5. **Nếu SEAL**: báo kết quả (node, evidence path, issue + branch từ bước
   1, PM status mới).
   - **Không có `--ship`** (mặc định): dừng ở đây. KHÔNG tự
     `git commit`/`git push`/mở PR — đó là việc của `/ship`, một bước riêng
     operator tự chạy.
   - **Có `--ship`**: gọi ngay `/ship "<task>"` đúng như skill đó định
     nghĩa — KHÔNG tự triển khai lại logic của `/ship` ở đây. `/ship` vẫn
     chạy đầy đủ hợp đồng riêng của nó: `SealedOnly` (đã thỏa vì SEAL vừa
     xảy ra), hiển thị đúng lệnh `git add`/`git commit`/`git push` thật và
     chờ operator approve, `NoForce`, `ReadBackBeforeClaim`, evidence note
     riêng. `--ship` trên `/todo` chỉ bỏ bớt việc gõ `/ship` thành lệnh thứ
     2 — KHÔNG bỏ qua seal gate của `/ship`.

## Hard rules honored
`IssueBranchFirst` (resolve/tạo GitHub issue + checkout branch riêng trước
mọi lệnh worker; tên branch và base luôn lấy từ issue đã resolve + git
workflow của `doctrine/domains/PROJECT.md`, không tự đoán; base branch
luôn được sync — `fetch`+`checkout`+`pull` — trước khi nhánh ra, không bao
giờ dùng bản local cũ) | Thừa hưởng toàn bộ hard rules của cả `implementer`
và `verifier` (xem `manifest.yaml` mỗi worker) | `SealedOnly`/`NoForce`/
`ReadBackBeforeClaim` (chỉ khi có `--ship`, qua lệnh `/ship` thật ở bước 5,
không tự triển khai lại ở đây) — `/todo` không có hard rule riêng ngoài
`IssueBranchFirst`, phần còn lại chỉ orchestrate.

## Failure branches
| Failure | Handling |
|---|---|
| `#<number>` nhưng issue không tồn tại / `gh` chưa auth | Dừng, báo lỗi `gh` thật verbatim |
| Free-text task nhưng `gh issue create` lỗi (không remote, chưa auth...) | Dừng, báo lỗi — không bao giờ chạy tiếp mà thiếu issue |
| Base branch không rõ từ `doctrine/domains/PROJECT.md` | Dừng, hỏi lại — không tự đoán |
| `git fetch`/`checkout <base>`/`pull` lỗi (dirty tree, conflict, không remote...) | Dừng, báo lỗi thật verbatim — không tự force/stash/discard thay operator |
| `gh issue develop`/checkout lỗi (dirty tree, base ref không tồn tại...) | Dừng, báo lỗi thật verbatim — không tự force/stash/discard thay operator |
| Lượt 1 báo `blocked` (thiếu env var, task mơ hồ...) | Dừng ngay, không chạy lượt 2, báo operator |
| REOPEN 3 lần liên tiếp cùng lý do | Dừng, nghi ngờ acceptance criteria hoặc recipe sai — báo operator xem lại node/task, không tự đoán thêm lần 4 |
| Verifier không tìm thấy evidence note của lượt 1 | Dừng, báo lỗi — không tự đoán lượt 1 đã làm gì |
| Task đòi hỏi outward-facing action ngay giữa lượt 1 | SEAL GATE trong recipe `implement.md` vẫn dừng lại chờ approval như bình thường, `/todo` không bỏ qua bước này |
| Có `--ship` nhưng vòng lặp dừng ở `blocked`/`failed`/hết retry (chưa SEAL) | Không gọi `/ship` — chưa có gì để ship |
| Có `--ship`, đã SEAL, nhưng `/ship` tự từ chối (vd build đỏ) | Báo lỗi thật của `/ship` — SEAL ở bước 5 vẫn giữ nguyên, chỉ bước ship thất bại |

## Runtime
`/todo "<task>"|#<issue-number> [--ship]`. Trước tiên resolve (hoặc tạo)
GitHub issue, sync base branch (`fetch`+`checkout`+`pull`, không bao giờ
dùng bản local cũ), rồi checkout branch `<number>-<slug>` riêng của nó qua
`gh issue develop` — chưa gọi worker nào trước khi xong phần này. Phần còn
lại giống hệt gọi tay `/worker implementer` rồi `/worker verifier`
(subagent) nối tiếp, lặp lại khi REOPEN, rồi — chỉ khi có `--ship` và vòng
lặp kết thúc ở SEAL — gọi thẳng `/ship "<task>"`. Dùng khi muốn 1 lệnh thay
vì gõ `/worker implementer` rồi `/worker verifier` tay; dùng 2 lệnh tách
khi muốn tự đọc evidence giữa 2 bước trước khi để verifier chấm.

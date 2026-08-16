# doctrine/INDEX.md — map của doctrine

> Doctrine là VERIFIED TRUTH. Phỏng đoán, ý tưởng dang dở KHÔNG
> thuộc về đây — chúng thuộc `evidence/` note hoặc diagram note.

## Read in this order
| File | What it is | When you need it |
|---|---|---|
| `SOUL.md` | Identity của hub agent | Trước khi tự ý quyết định thay đổi gì |
| `MEMORY.md` | Path, stack, lệnh chính xác | Mọi phiên, ngay từ đầu |
| `domains/PROJECT.md` | Ground truth riêng project (kể cả traps kế thừa từ `agent-hub/histories/`) | Trước khi implement |
| `standards/edit-verification.md` | Luật không claim thứ chưa quan sát | Trước khi báo "done" |
| `standards/recipes.md` | Recipe là gì, khi nào viết | Khi lặp lại 1 quy trình lần 2 |

## The three kinds of knowledge here
| Kind | Home | Example |
|---|---|---|
| Về hub | `SOUL.md` / `MEMORY.md` | Lệnh build/lint chính xác |
| Về domain/project | `domains/PROJECT.md` | Invariant riêng project này (never push to main, no test suite...) |
| Về cách làm việc | `standards/*.md` | Format recipe bắt buộc |

Một fact nằm sai ngăn là một fact không ai tin.

## Growing the doctrine
Chỉ thêm file/mục khi CẢ 3 đúng: (1) verified, (2) durable, (3) NOT
INFERABLE — agent đọc code 2 phút không tự suy ra được. Trượt điều (3) thì
đừng viết — doctrine mà chỉ nhại lại code sẽ cũ đi âm thầm và đánh lừa người
đọc.

## Correcting the doctrine
Sửa file, VÀ ghi "tôi từng tin gì / thực tế là gì" vào bảng Corrections
trong `MEMORY.md` của worker liên quan. Xoá âm thầm một fact sai = mất luôn
bài học đằng sau nó.

## Deliberately absent
Không có `laws/`, `architecture/`, `uplifts/`, `training/`. Chỉ thêm khi đã
có bài học thật sự cần nó — không thêm trước.

## Migrated from `agent-hub/histories/`
`histories/2026-08-11.md` và `histories/2026-08-13.md` là work-log cũ (quy
ước trước khi hub này tồn tại) — GIỮ NGUYÊN, không xoá, vẫn còn giá trị tham
khảo tường thuật chi tiết. Mọi trap/decision durable trong đó đã được rút ra
và ghi vào `domains/PROJECT.md`. Từ 2026-08-16 trở đi, audit trail mới đi
vào `evidence/`, không phải `histories/` nữa.

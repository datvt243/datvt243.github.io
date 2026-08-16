---
name: boot
description: Orientation 60 giây cho agent-hub của datvt243.github.io — đọc doctrine + diagram + evidence gần nhất, KHÔNG sửa gì. Trigger: /boot
---

# /boot

Chỉ đọc, không sửa gì. 7 bước, theo đúng thứ tự:

1. `agent-hub/NORTHSTAR.md`
2. Root `CLAUDE.md` (project thật: stack/architecture/commands)
3. `agent-hub/CLAUDE.md` (hợp đồng hub)
4. `agent-hub/doctrine/MEMORY.md`
5. `agent-hub/doctrine/domains/PROJECT.md`
6. `agent-hub/haven/diagrams/*.prime-mermaid.md` — mọi node + PM status
7. `agent-hub/haven/workers/*/MEMORY.md` (nếu có) + 5 evidence note gần
   nhất trong `agent-hub/evidence/` (mới nhất trước, theo mtime)

Sau đó báo cáo **đúng 6 dòng**, không hơn không kém:

```
🎯 Northstar: <one sentence từ NORTHSTAR.md>
✅ Forbidden: <none active | liệt kê state đang vi phạm nếu có>
📊 Diagrams: <N nodes = X sealed, Y pending, Z in_progress>
🔧 Workers: implementer, verifier
📝 Last action: <tóm tắt evidence note mới nhất, kèm ngày>
🚧 Blockers: <none | liệt kê <<FILL>> hoặc env var còn thiếu>
```

Không tự ý làm thêm gì sau report này — chờ lệnh `/worker` hoặc `/todo` tiếp
theo từ operator.

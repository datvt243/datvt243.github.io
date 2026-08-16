# BOOT.md — 5 sự thật định hướng

> Đọc bởi lệnh `/boot`. KHÔNG thay thế `doctrine/` — chỉ là launchpad 60
> giây để không phải đọc lại toàn bộ mỗi phiên.

1. Doctrine (`doctrine/`) là nơi giữ sự thật đã verify — model reset mỗi
   phiên, doctrine thì không.
2. Recipes (`haven/workers/*/recipes/`) là suy luận đã lưu — dùng lại thay
   vì suy luận lại từ đầu.
3. Hành động của worker phải quan sát được thật (build/lint output, screenshot
   qua Chrome CDP), không phải "hình dung ra". Project này không có test
   suite — đừng tưởng tượng ra kết quả test.
4. Mọi việc outward-facing (commit/push/PR/xoá file) cần approval của
   operator — không có ngoại lệ, kể cả khi `/todo` tự chạy 2 lượt.
5. Evidence or it didn't happen. Confidence không phải là output.

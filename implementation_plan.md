# 📋 Taskora - Implementation Plan & Checklist

Dự án Taskora - Ứng dụng quản lý công việc dạng Kanban (Trello Clone) áp dụng Fullstack MERN. Dưới đây là danh sách các tính năng được định hướng chuẩn Portfolio để gây ấn tượng với nhà tuyển dụng, được sắp xếp theo mức độ ưu tiên.

## ✅ Sprint 1: Nền tảng luồng người dùng (Authentication & Routing)
*Trạng thái: Đã hoàn thành*
- [x] Thiết kế UI Trang Đăng nhập / Đăng ký dùng chung (Toggleable).
- [x] Xây dựng Backend Auth: Đăng ký & Đăng nhập (Mã hóa Hash mật khẩu với `bcryptjs`).
- [x] Cấp phát và xác thực JWT (`jsonwebtoken`).
- [x] Phân quyền Routing ở Frontend (`ProtectedRoute`, `PublicRoute`).
- [x] Xử lý lưu `token` an toàn ở LocalStorage và gắn vào Axios Instance.

## ✅ Sprint 2: Cốt lõi Kanban (Board & Drag-Drop)
*Trạng thái: Đã hoàn thành*
- [x] Backend / Database: Thiết lập schema và API cơ bản cho Board, Column, Card.
- [x] Frontend UI: Giao diện danh sách Board (Dashboard) và giao diện Kanban bên trong.
- [x] Tính năng kéo & thả (Drag & Drop) UI Frontend sử dụng `@hello-pangea/dnd`.
- [x] Gọi API đồng bộ thứ tự Kéo & Thả (`orderIds`) cột và thẻ xuống Database.
- [x] Hoàn thiện thao tác CRUD: Cho phép Xóa hoàn toàn Thẻ (Card), Xóa nguyên Cột (Column), và Xóa toàn bộ Bảng (Board). Kể cả sửa tên của chúng.
- [x] Chi tiết Card (Modal Card Details): Gắn nhãn màu (Label), Thêm mô tả (Description), Hạn chót (Due Date).

## ⏳ Sprint 3: Hợp tác & Thành viên (Collaboration)
*Trạng thái: Tạm hoãn để qua Sprint 4*
- [x] System ACL (Quyền truy cập): Chặn API để chỉ Owner hoặc Member mới thao tác được Board.
- [x] Mời thành viên (Add Members): Thêm user khác vào Board bằng Email trực tiếp.
- [x] Gán việc (Assign to Card): Giao member vào từng Card cụ thể.
- [x] **[BACKEND] Quản lý Role**: Viết API thăng hạng Admin/Member.
- [x] **[BACKEND] Member Removal**: Viết logic xóa người khỏi board & rời bảng an toàn.

## 🏗️ Sprint 4: Cá nhân hóa tài khoản (User Settings)
*Trạng thái: Đang thực hiện*
- [x] Đổi mật khẩu/Thông tin: Chỉnh sửa tên hiển thị và bảo mật tài khoản.
- [x] Ảnh đại diện (Profile Picture): Upload và thay đổi ảnh cá nhân (Cloudinary).
- [x] Dark Mode (Giao diện tối): Tích hợp Theme switcher cho hệ thống.

## 🚀 [BONUS] Cấp độ "Săn Intern" (Advanced Features)
- [ ] **Real-time Sync (Socket.io)**: Đồng bộ hoạt động Board ngay lập tức (Kéo thả, sửa card...).
---
**Ghi chú:** Khi hoàn thành, hãy đổi `[ ]` thành `[x]` để tick xanh nhiệm vụ.

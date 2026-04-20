# 📋 Taskora - Implementation Plan & Checklist

Dự án Taskora - Ứng dụng quản lý công việc dạng Kanban (Trello Clone) áp dụng Fullstack MERN. Dưới đây là danh sách các tính năng được định hướng chuẩn Portfolio để gây ấn tượng với nhà tuyển dụng, được sắp xếp theo mức độ ưu tiên.

## ✅ Sprint 1: Nền tảng luồng người dùng (Authentication & Routing)
*Trạng thái: Đã hoàn thành*
- [x] Thiết kế UI Trang Đăng nhập / Đăng ký dùng chung (Toggleable).
- [x] Xây dựng Backend Auth: Đăng ký & Đăng nhập (Mã hóa Hash mật khẩu với `bcryptjs`).
- [x] Cấp phát và xác thực JWT (`jsonwebtoken`).
- [x] Phân quyền Routing ở Frontend (`ProtectedRoute`, `PublicRoute`).
- [x] Xử lý lưu `token` an toàn ở LocalStorage và gắn vào Axios Instance.

## 🚧 Sprint 2: Cốt lõi Kanban (Board & Drag-Drop)
*Trạng thái: Đang thực hiện*
- [x] Backend / Database: Thiết lập schema và API cơ bản cho Board, Column, Card.
- [x] Frontend UI: Giao diện danh sách Board (Dashboard) và giao diện Kanban bên trong.
- [x] Tính năng kéo & thả (Drag & Drop) UI Frontend sử dụng `@hello-pangea/dnd`.
- [x] Gọi API đồng bộ thứ tự Kéo & Thả (`orderIds`) cột và thẻ xuống Database.
- [ ] Hoàn thiện thao tác CRUD: Cho phép Xóa hoàn toàn Thẻ (Card), Xóa nguyên Cột (Column), và Xóa toàn bộ Bảng (Board). Kể cả sửa tên của chúng.
- [x] Chi tiết Card (Modal Card Details): Gắn nhãn màu (Label), Thêm mô tả (Description), Hạn chót (Due Date).

## ⏳ Sprint 3: Hợp tác & Thành viên (Collaboration)
*Trạng thái: Chưa làm (Việc bạn vừa đề xuất)*
- [ ] System ACL (Quyền truy cập): Logic chặn API để chỉ người tạo (Owner) hoặc người được mời mới xem/thao tác được trong Board.
- [ ] Mời thành viên (Add Members): Thêm user khác vào làm việc chung trong 1 Board.
- [ ] Gán việc (Assign to Card): Assign member vào riêng từng cụ thể Card (ví dụ Dev A làm task này).
- [ ] Push Notification (Email): Gửi mail báo cho user khi họ được mời vào Board (Sử dụng Nodemailer / Google SMTP). 

## ⏳ Sprint 4: Cá nhân hóa tài khoản (User Settings)
*Trạng thái: Chưa làm*
- [ ] Page Settings / Profile: Chỉnh sửa thông tin cá nhân (Đổi tên, Đổi hình đại diện Avatar, Đổi mật khẩu).
- [ ] Đăng nhập bằng Google (Google OAuth2 - Login with Google).

## 🌟 Sprint 5: Bonus (Điểm cộng mạnh cho Intern - Nếu còn thời gian)
*Tính năng thêm, bạn cân nhắc làm để vượt qua các ứng viên khác*
- [ ] Real-time với Socket.io: Khi bạn kéo thẻ ở máy 1, máy 2 cũng thấy thẻ đó thay đổi vị trí ngay lập tức (Trello thật hoạt động như thế).
- [ ] Lịch sử hoạt động (Activity Logs): Ghi nhận các hành động như "Khôi vừa chuyển thẻ X sang cột Done".
- [ ] Tìm kiếm (Search): Thanh tìm kiếm nhanh Card hoặc Board trên Header.

---
**Gợi ý cách sử dụng:**
Khi làm xong tính năng nào, bạn chỉ cần sửa `[ ]` thành `[x]` ở file markdown này. Nó sẽ tự động biến thành dấu tick xanh dính liền trên giao diện Github của dự án.

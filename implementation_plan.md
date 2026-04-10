# Kế hoạch phát triển Taskora (Project Apply Intern)

Đây là các tính năng quan trọng nhất được chia thành từng Sprint (Giai đoạn ngắn). Mục tiêu là chứng minh cho nhà tuyển dụng thấy bạn có khả năng làm: **Hoàn thiện luồng ứng dụng thực tế, Hiểu về Authentication/JWT, Hiểu về UI/UX cơ bản, và Chức năng cốt lõi hoạt động ổn định**.

## Sprint 1: Hoàn thiện chức năng cốt lõi (Core Kanban)
Mục tiêu: Đảm bảo bảng Board có thể sử dụng được như một Todo App thực tế.

*   **[Core] Khôi phục Drag & Drop (Kéo thả):**
    *   Kéo thả Card giữa các Column.
    *   Kéo thả các Column để đổi vị trí.
    *   *Tại sao quan trọng:* Kéo thả là linh hồn của các app dạng Kanban (Trello). Nhà tuyển dụng thường đánh giá cao những ai xử lý mượt API khi thứ tự mảng (`orderIds`) thay đổi.
*   **[Core] Chi tiết Card (Card Details) Cơ bản:**
    *   Cho phép gắn Labels (Nhãn màu) để dễ nhìn.
    *   Thêm Due Dates (Hạn chót) đơn giản để UI thẻ bớt trống trải.

## Sprint 2: Hoàn thiện Luồng Người dùng (Auth Flow & Navbar)
Mục tiêu: Quản lý phiên làm việc của user một cách nghiêm túc (điều mọi dự án thực tế đều cần).

*   **Authentication (Đăng ký/Đăng nhập/Đăng xuất):**
    *   Giao diện Signup / Login đẹp mắt.
    *   Lưu trữ JWT token an toàn ở Frontend (Local Storage hoặc Cookie).
    *   Điều hướng thông minh (Protect Routes: Chưa login thì bị văng ra Login, đã login thì không vào được trang Login nữa).
*   **Xây dựng Header / Navbar chung:**
    *   Có thanh Navbar xuất hiện ở hầu hết các trang.
    *   Nút User Avatar với Dropdown menu (Profile, Cài đặt, Đăng xuất).

## Sprint 3: Quản lý Board & Cài đặt Cá nhân (Settings)
Mục tiêu: Tạo cảm giác đây là một "Sản phẩm hoàn chỉnh" chứ không chỉ là "Một trang code dở".

*   **Trang Dashboard (Trang chủ User):**
    *   Sau khi Login, user vào trang hiển thị danh sách tất cả các Board của họ (bao gồm Board tự tạo và Board được người khác mời).
    *   Nút tạo mới Board.
    *   **Chia sẻ làm việc chung:** Chức năng Mời Thành Viên (Invite Members) vào quản lý chung Board thông qua Email.
*   **Trang Cài đặt Tài khoản (Account Settings):**
    *   Người dùng có thể đổi Tên, Đổi mật khẩu.
    *   *Tại sao quan trọng:* Cho thấy bạn biết làm các form cập nhật dữ liệu (`PUT`/`PATCH` API), kết hợp xác thực mật khẩu cũ/mới ở Back-end.

---

## Bạn đánh giá sao về 3 Sprint này?
Kế hoạch này đảm bảo **Vừa đủ chức năng của Trello, Vừa show off được toàn bộ kỹ năng Web Fullstack**.
Nếu chốt hướng này, bạn muốn bắt tay vào sửa **Sprint 1 (Khôi phục Kéo Thả và Detail Card)** hay nhảy sang **Sprint 2 (Làm Auth & Navbar)** trước?

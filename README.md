# Fibaro HC3 MCP Server

MCP Server để điều khiển Fibaro Home Center 3 thông qua Claude.

## Tính năng

- **Tự động kết nối** với Fibaro HC3 khi khởi động (cấu hình một lần)
- Lấy thông tin devices, scenes, và rooms
- Điều khiển devices (bật/tắt, set giá trị)
- Chạy và dừng scenes
- Tích hợp hoàn toàn với Claude để điều khiển bằng ngôn ngữ tự nhiên

## Cài đặt

1. Clone hoặc tải project này
2. Cài đặt dependencies:

```bash
npm install
```

3. Build project:

```bash
npm run build
```

4. **Chạy script cài đặt tự động:**

```bash
./install-claude.sh
```

Script này sẽ:
- Hỏi thông tin kết nối Fibaro HC3 (IP, username, password)
- Test kết nối để đảm bảo thông tin đúng
- Tự động cấu hình Claude Desktop
- Lưu thông tin đăng nhập an toàn trong cấu hình MCP

## Sử dụng

Sau khi cài đặt, **không cần kết nối thủ công** nữa. MCP server sẽ tự động kết nối tới Fibaro HC3 khi Claude khởi động.

### 1. Xem danh sách devices

```
Hiển thị tất cả devices
```

### 2. Điều khiển đèn

```
Tắt đèn số 3
```

```
Bật đèn phòng khách
```

```
Chỉnh độ sáng đèn số 5 về 50%
```

### 3. Điều khiển đèn RGB

```
Chuyển đèn RGB số 10 sang màu đỏ
```

```
Set đèn RGB số 10 thành màu tím (255,0,255,0)
```

### 4. Chạy scenes

```
Chạy scene "Good Night"
```

## Các lệnh có sẵn

### Thông tin
- `fibaro_get_devices`: Lấy danh sách tất cả devices
- `fibaro_get_device`: Lấy thông tin chi tiết device theo ID
- `fibaro_get_scenes`: Lấy danh sách tất cả scenes
- `fibaro_get_scene`: Lấy thông tin chi tiết scene theo ID
- `fibaro_get_rooms`: Lấy danh sách tất cả rooms

### Điều khiển
- `fibaro_turn_on_device`: Bật device theo ID
- `fibaro_turn_off_device`: Tắt device theo ID
- `fibaro_set_device_value`: Set giá trị property cho device
- `fibaro_set_brightness`: Set độ sáng cho đèn/dimmer (0-100%)
- `fibaro_set_color`: Set màu RGB cho đèn RGB (R,G,B,W: 0-255)
- `fibaro_run_scene`: Chạy scene theo ID
- `fibaro_stop_scene`: Dừng scene theo ID

## Ví dụ tích hợp

Sau khi cấu hình xong, bạn có thể nói chuyện với Claude như:

- "Tắt tất cả đèn trong nhà"
- "Bật đèn phòng ngủ"
- "Chạy scene good morning"
- "Hiển thị trạng thái tất cả sensors"
- "Set độ sáng đèn phòng khách là 50%"
- "Chuyển đèn RGB phòng khách sang màu xanh lá"
- "Đặt đèn RGB số 5 thành màu tím nhạt"

Claude sẽ tự động:
1. Kết nối tới Fibaro HC3 (nếu chưa kết nối)
2. Tìm devices/scenes phù hợp
3. Thực hiện lệnh điều khiển
4. Báo cáo kết quả

## Bảo mật

- Server này chỉ kết nối local tới Fibaro HC3
- Thông tin đăng nhập chỉ được lưu trong phiên làm việc
- Sử dụng HTTPS với self-signed certificate được chấp nhận
- Không lưu trữ thông tin nhạy cảm

## Troubleshooting

### Không kết nối được tới Fibaro HC3

- Chạy lại script cài đặt: `./install-claude.sh`
- Kiểm tra IP address và port (mặc định: 443)
- Đảm bảo username/password đúng
- Kiểm tra firewall và network connectivity
- Thử truy cập web interface của HC3 từ browser

### MCP Server không hoạt động

- Kiểm tra đường dẫn trong cấu hình Claude
- Đảm bảo project đã được build (`npm run build`)
- Restart Claude Desktop sau khi thay đổi cấu hình
- Kiểm tra log của Claude Desktop để xem lỗi chi tiết

### Thay đổi thông tin kết nối Fibaro HC3

Để thay đổi IP, username hoặc password:
1. Chạy lại script cài đặt: `./install-claude.sh`
2. Nhập thông tin mới
3. Restart Claude Desktop
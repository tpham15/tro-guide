# Trọ Guide

Dịch vụ dẫn khách xem phòng trọ không môi giới, không thổi giá.

## Kiến trúc mới

Dự án được tách rõ thành backend API (Express + SQLite) và static frontend:

```
tro-guide/
├── backend/     # Node/Express REST API, kết nối SQLite
├── frontend/    # HTML/CSS/JS thuần, gọi API qua fetch
├── data.db      # SQLite database (cùng cấp root để cả hai môi trường dùng chung)
└── package.json # Workspace gốc chỉ để chạy npm workspaces
```

## Backend

```
cd backend
npm install
npm run dev   # nodemon src/server.js
```

- API chạy ở `http://localhost:3000` (đổi bằng `PORT`).
- Biến `FRONTEND_ORIGIN` dùng để cấu hình CORS khi deploy (mặc định `*` cho local).
- Các script khởi tạo DB nằm trong `backend/src/scripts`.

### Khởi tạo database

```bash
# tạo schema
sqlite3 data.db < backend/src/scripts/init-db.sql

# (tuỳ chọn) thêm dữ liệu demo
sqlite3 data.db < backend/src/scripts/seed-demo.sql
```

Xem thêm hướng dẫn deploy Render trong `backend/README-backend.md`.

## Frontend

Static assets nằm trong `frontend/`. Không cần build – có thể mở `frontend/index.html` trực tiếp
hoặc deploy lên Netlify/Vercel/Render Static.

- `frontend/main.js` (booking form) và `frontend/admin.js` (dashboard) dùng biến
  `BASE_API_URL` để gọi API (auto default `http://localhost:3000` khi chạy local).
  Khi deploy, đặt `window.BASE_API_URL` trong HTML hoặc sửa giá trị mặc định.
- Có sẵn script dev: `npm run dev` (dùng `npx serve .`) nếu cần một HTTP server tĩnh.

## Lệnh hữu ích ở workspace gốc

```bash
npm run dev:backend      # chạy API
npm run start:backend    # chạy API production
npm run dev:frontend     # preview frontend tĩnh qua npx serve
```

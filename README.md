# Trọ Guide

Dịch vụ dẫn khách xem phòng trọ không môi giới, không thổi giá.

## Yêu cầu hệ thống

- Node.js 18+
- SQLite CLI (để tạo file database)

## Cài đặt

```bash
npm install
```

## Khởi tạo database

```bash
# tạo file data.db với schema
sqlite3 data.db < src/scripts/init-db.sql

# (tuỳ chọn) thêm dữ liệu demo
sqlite3 data.db < src/scripts/seed-demo.sql
```

## Chạy server

```bash
npm run dev
# hoặc chạy production
npm start
```

Server chạy ở `http://localhost:3000` (đổi bằng biến môi trường `PORT`).

## Frontend

- Trang khách: `http://localhost:3000/index.html`
- Trang admin: `http://localhost:3000/admin.html`

## Cấu trúc dự án

```
tro-guide/
├── package.json
├── src/
│   ├── server.js
│   ├── db.js
│   ├── config.js
│   ├── routes/
│   └── services/
├── public/
│   ├── index.html
│   ├── admin.html
│   └── admin.js
└── src/scripts/
    ├── init-db.sql
    └── seed-demo.sql
```
# tro-guide

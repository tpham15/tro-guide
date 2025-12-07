## Trọ Guide Backend (Render notes)

1. **Repo setup**
   - Root directory for service: `backend`
   - Node version: `18`
   - Build command: `npm install`
   - Start command: `npm run start`

2. **Environment variables**
   - `PORT` – Render tự set, không cần chỉnh.
   - `FRONTEND_ORIGIN` – domain của static frontend (ví dụ `https://tro-guide.web.app`).
   - `DB_PATH` – đường dẫn tới SQLite file (mặc định là `../data.db` tính từ `backend/src/`).

3. **Persistent SQLite**
   - Upload `data.db` vào Render Disk hoặc S3 rồi mount vào `/data/data.db` và cập nhật `DB_PATH`.
   - Hoặc dùng Render PostgreSQL và cập nhật code (chưa triển khai).

4. **CORS**
   - Trong `src/server.js`, `FRONTEND_ORIGIN="*"` thì API mở cho mọi domain (chỉ nên dùng khi dev).
   - Khi deploy, set `FRONTEND_ORIGIN` trùng với domain static frontend để giảm rủi ro.

5. **Health check**
   - Render hỗ trợ hitting `/api/guides` hoặc `/api/bookings` – không còn serving static files.

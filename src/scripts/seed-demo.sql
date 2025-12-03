INSERT INTO guides (name, phone, area, note)
VALUES
  ('Anh Nam', '0909000111', 'Bình Thạnh', 'Rành khu chợ Thị Nghè'),
  ('Chi Hoa', '0909555777', 'Thủ Đức', 'Ưu tiên sinh viên');

INSERT INTO bookings (
  customer_name,
  customer_phone,
  customer_zalo,
  area,
  area_main,
  area_detail,
  budget_min,
  budget_max,
  room_type,
  rooms_to_view,
  time_slot,
  note,
  status
) VALUES
  ('Le Minh', '0903332222', 'zalo:minh', 'Quận 1 - Gần phố đi bộ Nguyễn Huệ', 'Quận 1', 'Gần phố đi bộ Nguyễn Huệ', 4000000, 6000000, 'tro', 3, 'Sau 19h các ngày', 'Ưu tiên gần trung tâm', 'pending'),
  ('Tran Khanh', '0988111222', NULL, 'TP.Thủ Đức - Khu Linh Trung', 'TP.Thủ Đức', 'Khu Linh Trung', 3000000, 4500000, 'cth', 2, 'Cuối tuần', 'Cần chỗ gửi xe hơi', 'pending');

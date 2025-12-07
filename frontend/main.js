/**
 * Standalone booking form logic for the static frontend.
 * Update BASE_API_URL to match the deployed backend domain (Render, etc.).
 */
// Change this when deploying backend to another domain.
const BASE_API_URL = 'https://tro-guide.onrender.com';
const BOOKINGS_ENDPOINT = `${BASE_API_URL}/api/bookings`;

const form = document.getElementById('booking-form');
const messageBox = document.getElementById('message');

const showMessage = (type, text) => {
  messageBox.textContent = text;
  messageBox.className = `alert ${type}`;
  messageBox.style.display = 'block';
};

const roomTypeInputs = Array.from(document.querySelectorAll('input[name="room_type"]'));

const enforceRoomTypeLimit = () => {
  const checked = roomTypeInputs.filter((input) => input.checked);
  if (checked.length >= 2) {
    roomTypeInputs.forEach((input) => {
      if (!input.checked) {
        input.disabled = true;
      }
    });
  } else {
    roomTypeInputs.forEach((input) => {
      input.disabled = false;
    });
  }
};

roomTypeInputs.forEach((input) => {
  input.addEventListener('change', enforceRoomTypeLimit);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  messageBox.style.display = 'none';

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  payload.budget_min = payload.budget_min ? Number(payload.budget_min) : null;
  payload.budget_max = payload.budget_max ? Number(payload.budget_max) : null;
  payload.rooms_to_view = payload.rooms_to_view ? Number(payload.rooms_to_view) : 1;

  const selectedRoomTypes = Array.from(form.querySelectorAll('input[name="room_type"]:checked')).map(
    (input) => input.value
  );
  if (!selectedRoomTypes.length) {
    showMessage('error', 'Vui lòng chọn ít nhất 1 loại phòng.');
    return;
  }
  payload.room_type = selectedRoomTypes.join(',');

  const areaMain = payload.area_main ? payload.area_main.trim() : '';
  const areaDetail = payload.area_detail ? payload.area_detail.trim() : '';
  const existingArea = payload.area ? payload.area.trim() : '';

  let computedArea = existingArea;
  if (!computedArea) {
    if (areaMain && areaDetail) {
      computedArea = `${areaMain} - ${areaDetail}`;
    } else if (areaMain) {
      computedArea = areaMain;
    } else if (areaDetail) {
      computedArea = areaDetail;
    }
  }

  payload.area_main = areaMain || null;
  payload.area_detail = areaDetail || null;
  payload.area = computedArea;

  try {
    const res = await fetch(BOOKINGS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || 'Không gửi được yêu cầu');
    }
    form.reset();
    roomTypeInputs.forEach((input) => {
      input.disabled = false;
    });
    showMessage('success', 'Đã gửi yêu cầu. Trọ Guide sẽ liên hệ bạn sớm nhất!');
  } catch (err) {
    showMessage('error', err.message);
  }
});

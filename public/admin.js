const bookingsBody = document.getElementById('bookings-body');
const statusFilter = document.getElementById('status-filter');
const refreshBtn = document.getElementById('refresh-btn');
const tabButtons = document.querySelectorAll('.tab-button');
const bookingsSection = document.getElementById('bookings-section');
const guidesSection = document.getElementById('guides-section');
const guidesBody = document.getElementById('guides-body');
const guideForm = document.getElementById('guide-form');
let guidesLoaded = false;

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = 'Có lỗi xảy ra';
    try {
      const body = await res.json();
      message = body.error || message;
    } catch (err) {
      // ignore
    }
    throw new Error(message);
  }
  return res.json();
};

const loadBookings = async () => {
  const status = statusFilter.value;
  const query = status ? `?status=${status}` : '';
  const bookings = await fetchJSON(`/api/bookings${query}`);
  renderBookings(bookings);
};

const fetchGuides = () => fetchJSON('/api/guides');
const loadGuides = async () => {
  const guides = await fetchGuides();
  renderGuides(guides);
  guidesLoaded = true;
};

const handleAssign = async (bookingId) => {
  try {
    const guides = await fetchGuides();
    if (!guides.length) {
      alert('Chưa có guide nào trong hệ thống.');
      return;
    }
    const guideOptions = guides
      .map((guide) => `${guide.id} - ${guide.name} (${guide.area})`)
      .join('\n');
    const guideIdInput = prompt(`Chọn guide theo ID:\n${guideOptions}`);
    if (!guideIdInput) return;
    const guideId = Number(guideIdInput);
    if (!guideId) {
      alert('ID không hợp lệ');
      return;
    }
    await fetchJSON(`/api/bookings/${bookingId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guide_id: guideId })
    });
    await loadBookings();
  } catch (err) {
    alert(err.message);
  }
};

const changeStatus = async (bookingId, nextStatus) => {
  try {
    await fetchJSON(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    await loadBookings();
  } catch (err) {
    alert(err.message);
  }
};

const renderBookings = (bookings) => {
  if (!bookings.length) {
    bookingsBody.innerHTML = `<tr><td colspan="8">Chưa có booking nào</td></tr>`;
    return;
  }

  bookingsBody.innerHTML = bookings
    .map((booking) => {
      const budget = booking.budget_min || booking.budget_max
        ? `${booking.budget_min || '?'} - ${booking.budget_max || '?'}`
        : 'N/A';
      const ROOM_TYPE_LABELS = {
        tro: 'Phòng trọ',
        cth: 'Chung cư thường',
        ccmini: 'Chung cư mini',
        canho: 'Căn hộ dịch vụ',
        ghep: 'Phòng ghép',
        nhangan: 'Nhà nguyên căn'
      };
      const roomTypes = booking.room_type
        ? booking.room_type
            .split(',')
            .map((type) => ROOM_TYPE_LABELS[type.trim()] || type.trim())
            .join(', ')
        : '-';
      const areaDisplay = [];
      if (booking.area_main) {
        areaDisplay.push(`<div class="area-main-text">${booking.area_main}</div>`);
      }
      if (booking.area_detail) {
        areaDisplay.push(`<div class="area-detail-text">${booking.area_detail}</div>`);
      }
      if (!areaDisplay.length && booking.area) {
        areaDisplay.push(`<div class="area-main-text">${booking.area}</div>`);
      }
      const actions = `
        <div class="actions">
          <button data-action="assign" data-id="${booking.id}">Gán guide</button>
          <button data-action="status" data-status="done" data-id="${booking.id}">Done</button>
          <button data-action="status" data-status="pending" data-id="${booking.id}">Pending</button>
          <button data-action="status" data-status="cancelled" data-id="${booking.id}">Cancel</button>
        </div>
      `;
      return `
        <tr>
          <td>${booking.id}</td>
          <td>
            <strong>${booking.customer_name}</strong><br />
            ${booking.customer_phone}<br />
            ${booking.customer_zalo || ''}
          </td>
          <td>${areaDisplay.join('')}</td>
          <td>${budget}</td>
          <td>${roomTypes}</td>
          <td>${booking.status}</td>
          <td>${booking.guide_id || '-'}</td>
          <td>${actions}</td>
        </tr>
      `;
    })
    .join('');
};

const renderGuides = (guides) => {
  if (!guides.length) {
    guidesBody.innerHTML = `<tr><td colspan="4">Chưa có guide nào</td></tr>`;
    return;
  }
  guidesBody.innerHTML = guides
    .map(
      (guide) => `
        <tr>
          <td>${guide.name}</td>
          <td>${guide.phone}</td>
          <td>${guide.area}</td>
          <td>${guide.note || ''}</td>
        </tr>
      `
    )
    .join('');
};

const showTab = (tab) => {
  tabButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  bookingsSection.classList.toggle('active', tab === 'bookings');
  guidesSection.classList.toggle('active', tab === 'guides');
  if (tab === 'guides' && !guidesLoaded) {
    loadGuides().catch((err) => alert(err.message));
  }
};

tabButtons.forEach((button) => {
  button.addEventListener('click', () => showTab(button.dataset.tab));
});

if (guideForm) {
  guideForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(guideForm);
    const payload = Object.fromEntries(formData.entries());
    if (!payload.name || !payload.phone || !payload.area) {
      alert('Vui lòng nhập đủ thông tin bắt buộc.');
      return;
    }
    try {
      await fetchJSON('/api/guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      guideForm.reset();
      await loadGuides();
    } catch (err) {
      alert(err.message);
    }
  });
}

bookingsBody.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const bookingId = button.dataset.id;
  if (button.dataset.action === 'assign') {
    handleAssign(bookingId);
  }
  if (button.dataset.action === 'status') {
    changeStatus(bookingId, button.dataset.status);
  }
});

statusFilter.addEventListener('change', loadBookings);
refreshBtn.addEventListener('click', loadBookings);

loadBookings().catch((err) => alert(err.message));
showTab('bookings');

const properties = [
    { id: 1, name: "Дом на отшибе в Пустоши", district: "Уэстбрук", type: "Пентхаус", price: 1200, capacity: 3, status: "Премиум", x: 625, y: 145, image: "images/Poor_apartment_02.jpg", description: "Дом, построен в отдалении от остальных поселений Пустоши. Несмотря на удалённость, он предлагает комфорт и уединение.", amenities: ["Панорамный вид", "Умный дом", "Терраса", "Климат-контроль"], isBooked: false },
    { id: 2, name: "Тихоокеанские апартаменты", district: "Уотсон", type: "Лофт", price: 10000, capacity: 2, status: "Доступно", x: 190, y: 165, image: "images/Underwater_apartment.jpg", description: "Апартаменты класса Люкс+, расположенные прямо на дне Тихого Океана! Не нужно бояться высокого давления или местную флору и фауну: квартира оборудована новейшей технологией Epsilym-ER09, выполняющую роль умного дома и защищающую его от нежелательных объектов.", amenities: ["Лофт-планировка", "Wi-Fi", "Мини-кухня", "Подводный лифт"], isBooked: false },
    { id: 3, name: "Апартаменты-Люкс на Севере", district: "Городской центр", type: "Апартаменты", price: 7600, capacity: 2, status: "Премиум", x: 425, y: 255, image: "images/Luxury_apartment_01.jpg", description: "Строгие линии, технологичный интерьер и усиленная система безопасности. Адрес для тех, кому важны приватность и близость к деловому кварталу.", amenities: ["Консьерж 24/7", "Смарт-стекло", "Безопасность", "Рабочая зона"], isBooked: false },
    { id: 4, name: "Квартира в Районе Хакеров", district: "Хейвуд", type: "Апартаменты", price: 2400, capacity: 4, status: "Доступно", x: 265, y: 375, image: "images/Middle_apartment_01.jpg", description: "Светлая квартира в жилом квартале Хейвуд. Данная квартира станет идеальным пристанищем для тех, кто ценит уединенность и городской комфорт.", amenities: ["2 спальни", "Внутренний двор", "Кухня", "До 4 гостей"], isBooked: false },
    { id: 5, name: "Заброшенная квартира в Песках Памяти", district: "Пасифика", type: "Капсула", price: 2, capacity: 1, status: "Доступно", x: 680, y: 470, image: "images/Poor_apartment_01.jpg", description: "Почти ничего не известно об этих апартамениах: иногда там пропадают люди...", amenities: ["1 гость", "Ранее на это место, где сейчас стоит дом, упал НЛО", "Странные завывания за окном ночью", "Заброшенный дата-центр"], isBooked: false },
    { id: 6, name: "Комната в Капсульном Отеле в Аэропорте 01", district: "Уотсон", type: "Апартаменты", price: 6600, capacity: 3, status: "Доступно", x: 115, y: 245, image: "images/space_apartment_00.png", description: "Современные апартаменты с хромированными деталями и мягкой подсветкой. Удобная база для знакомства с северной частью Найт-Сити.", amenities: ["2 комнаты", "Умное освещение", "Wi-Fi", "До 3 гостей"], isBooked: false },
    { id: 7, name: "Сельский Кибер-дом на окраине города", district: "Хейвуд", type: "Апартаменты", price: 1300, capacity: 2, status: "Доступно", x: 200, y: 400, image: "images/Middle_apartment_02.jpg", description: "Просторная квартира в жилом районе Хейвуд. Уютная обстановка, всё необходимое для комфортного проживания.", amenities: ["2 комнаты", "Кухня", "Wi-Fi", "До 2 гостей"], isBooked: false },
    { id: 8, name: "Апартаменты-Люкс на Западе", district: "Городской центр", type: "Пентхаус", price: 7700, capacity: 3, status: "Премиум", x: 350, y: 255, image: "images/Luxury_apartment_02.jpg", description: "Элитный пентхаус с видом на город. Премиум-отделка и панорамные окна.", amenities: ["Панорамный вид", "Умный дом", "Терраса", "Климат-контроль"], isBooked: false },
    { id: 9, name: "Апартаменты-Люкс на Юге", district: "Городской центр", type: "Апартаменты", price: 7400, capacity: 2, status: "Премиум", x: 425, y: 350, image: "images/Luxury_apartment_03.jpg", description: "Роскошные апартаменты в южном квартале Городского центра. Безопасность и комфорт премиум-класса.", amenities: ["Консьерж 24/7", "Смарт-стекло", "Безопасность", "Рабочая зона"], isBooked: false }
];
let selectedId = null;
let activeProperty = null;
let bookings = [];
const STORAGE_KEY = 'ncr_bookings_v1';
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (Array.isArray(data)) { bookings = data; }
        // Занятость определяется только активными бронями.
        properties.forEach(p => p.isBooked = data.some(b => b.propertyId === p.id && b.status === "active"));
    } catch (e) { console.error('Невозможно загрузить брони из localStorage', e); }
}
function saveToStorage() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings)); } catch (e) { console.error('Невозможно сохранить брони в localStorage', e); }
}
const $ = id => document.getElementById(id);
const list = $("listingList"), pins = $("mapPins"), detailPanel = $("detailPanel"), detailPanelBody = $("detailPanelBody"), detailPanelTitle = $("detailPanelTitle");
const money = n => "ED " + n.toLocaleString("en-US");
const availability = p => p.isBooked ? "ЗАБРОНИРОВАНО" : "ДОСТУПНО";
function setFieldError(id, message) {
    const field = $(id); if (!field) return;
    let node = document.getElementById(id + "Error");
    if (!node) { node = document.createElement("small"); node.id = id + "Error"; node.className = "field-error"; node.setAttribute("aria-live", "polite"); field.insertAdjacentElement("afterend", node); }
    node.textContent = message || ""; field.classList.toggle("field-invalid", !!message); field.setAttribute("aria-invalid", message ? "true" : "false");
}
function clearBookingErrors(prefix = "") {
    ["checkIn", "checkOut", "guestName", "guests", "inlineCheckIn", "inlineCheckOut", "inlineGuestName", "inlineGuests"].filter(id => id.startsWith(prefix)).forEach(id => setFieldError(id, ""));
}
function validateBooking(prefix, p) {
    const inId = prefix ? "inlineCheckIn" : "checkIn", outId = prefix ? "inlineCheckOut" : "checkOut", nameId = prefix ? "inlineGuestName" : "guestName", guestId = prefix ? "inlineGuests" : "guests";
    const checkin = $(inId).value, checkout = $(outId).value, name = $(nameId).value.trim(), guests = +$(guestId).value;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let valid = true;
    const a = checkin ? new Date(checkin + "T00:00:00") : null, b = checkout ? new Date(checkout + "T00:00:00") : null;
    if (!checkin) { setFieldError(inId, "Укажи дату заезда."); valid = false; }
    else if (a < today) { setFieldError(inId, "Дата заезда не может быть в прошлом."); valid = false; }
    else setFieldError(inId, "");
    if (!checkout) { setFieldError(outId, "Укажи дату выезда."); valid = false; }
    else if (a && b <= a) { setFieldError(outId, "Выезд должен быть позже заезда."); valid = false; }
    else setFieldError(outId, "");
    if (!name) { setFieldError(nameId, "Укажи имя для бронирования."); valid = false; }
    else setFieldError(nameId, "");
    if (guests > p.capacity) { setFieldError(guestId, `В апартаментах максимум ${p.capacity} гост${p.capacity === 1 ? "ь" : p.capacity < 5 ? "я" : "ей"}.`); valid = false; }
    else setFieldError(guestId, "");
    return valid;
}
function filtered() {
    const q = $("searchInput").value.trim().toLowerCase(), d = $("districtFilter").value, t = $("typeFilter").value, g = $("guestFilter").value, pr = +$("priceFilter").value;
    $("priceValue").textContent = `€${pr}`;
    return properties.filter(p => (d === "all" || p.district === d) && (t === "all" || p.type === t) && (g === "all" || p.capacity >= +g) && (pr >= 10000 || p.price <= pr) && (!q || [p.name, p.district, p.type, p.description].join(" ").toLowerCase().includes(q)));
}
function render() {
    const items = filtered();
    $("feedCount").textContent = String(items.length).padStart(2, "0") + " ЕДИНИЦ";
    $("mapCount").textContent = String(items.length).padStart(2, "0") + " ЕДИНИЦ";
    list.innerHTML = items.length ? items.map(p => `<article class="listing-card ${selectedId === p.id ? "selected" : ""}" data-id="${p.id}" tabindex="0">
 <div class="listing-thumb" style="background-image:url('${p.image}')"></div>
 <div class="listing-info"><div class="listing-topline"><span>${p.district.toUpperCase()} / ${p.type.toUpperCase()}</span><span class="availability-label ${p.isBooked ? "is-booked" : "is-available"}">${availability(p)}</span></div>
 <h3>${p.name}</h3><div class="listing-location">НАЙТ-СИТИ · ${p.capacity} ГОСТ${p.capacity === 1 ? "Ь" : p.capacity < 5 ? "Я" : "ЕЙ"}</div>
 <div class="listing-price"><strong>${money(p.price)}<span> / ночь</span></strong><span>ОТКРЫТЬ ↗</span></div></div></article>`).join("") : `<div class="empty-state">ОБЪЕКТЫ НЕ НАЙДЕНЫ.<br>Измени параметры поиска.</div>`;
    list.querySelectorAll(".listing-card").forEach(el => { el.addEventListener("click", () => selectProperty(+el.dataset.id, true)); el.addEventListener("keydown", e => { if (e.key === "Enter") selectProperty(+el.dataset.id, true) }) });
    pins.innerHTML = properties.map(p => `<div class="map-pin ${p.status == "Премиум" ? "premium" : ""} ${selectedId === p.id ? "selected" : ""} ${p.isBooked ? "booked" : ""}" data-id="${p.id}" tabindex="${p.isBooked ? -1 : 0}" role="button" aria-label="${p.name}${p.isBooked ? " (уже забронировано)" : ""}" title="${p.isBooked ? "Уже забронировано" : p.name}" style="left:${p.x / 900 * 100}%;top:${p.y / 590 * 100}%"><div class="pin-halo"></div><div class="pin-core"></div>${p.isBooked ? '<span class="pin-booked-label">ЗАНЯТО</span>' : ""}</div>`).join("");
    pins.querySelectorAll(".map-pin:not(.booked)").forEach(el => { el.addEventListener("click", () => selectProperty(+el.dataset.id, true)); el.addEventListener("keydown", e => { if (e.key === "Enter") selectProperty(+el.dataset.id, true) }) });
}
function selectProperty(id, open) {
    selectedId = id; const p = properties.find(x => x.id === id); if (!p) return; render();
    detailPanelTitle.textContent = p.name;
    if (open) showPropertyCover(p);
}
function showModal(id) { $(id).classList.add("open"); $(id).setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden" }
function hideModal(id) { $(id).classList.remove("open"); $(id).setAttribute("aria-hidden", "true"); if (!document.querySelector(".modal-backdrop.open")) document.body.style.overflow = "" }
function showDetail(p) {
    activeProperty = p; $("detailImage").style.backgroundImage = `url('${p.image}')`; $("detailTitle").textContent = p.name; $("detailDistrict").textContent = `${p.district.toUpperCase()} / ${p.type.toUpperCase()} / NIGHT CITY`; $("detailDescription").textContent = p.description; $("detailPrice").textContent = money(p.price); $("detailAmenities").innerHTML = p.amenities.map(a => `<span>${a}</span>`).join(""); showModal("detailModal");
}
function showPropertyCover(p) {
    activeProperty = p;
    detailPanelBody.innerHTML = `
  <div class="detail-cover" style="background-image:url('${p.image}')">
   <div class="detail-cover-tag ${p.isBooked ? "is-booked" : "is-available"}">${availability(p)}</div>
   <div class="detail-cover-info">
    <div class="detail-topline">${p.district.toUpperCase()} / ${p.type.toUpperCase()} / NIGHT CITY</div>
    <h2 class="detail-name">${p.name}</h2>
    <div class="detail-price"><strong>${money(p.price)}</strong><span>/ ночь</span></div>
    <p class="detail-short">${p.description}</p>
    <div class="detail-amenities">${p.amenities.map(a => `<span>${a}</span>`).join("")}</div>
   </div>
  </div>
  <div class="detail-actions">
   <button class="primary-btn" id="detailBtnFull">ПОДРОБНОСТИ ОБЪЕКТА <span>↗</span></button>
   <button class="primary-btn outline" id="detailBtnBook">ЗАБРОНИРОВАТЬ <span>↗</span></button>
  </div>
 `;
    $("detailBtnFull").addEventListener("click", () => showPropertyFull(p));
    if (p.isBooked) { $("detailBtnBook").textContent = "УЖЕ ЗАБРОНИРОВАНО"; $("detailBtnBook").disabled = true; } else $("detailBtnBook").addEventListener("click", () => showBookingForm(p));
}
function showPropertyFull(p) {
    activeProperty = p;
    detailPanelBody.innerHTML = `
  <button class="btn-back" id="detailBtnBack">← НАЗАД К ОБЛОЖКЕ</button>
  <div class="detail-full">
   <div class="detail-full-image" style="background-image:url('${p.image}')"></div>
   <div class="detail-full-content">
    <div class="detail-topline">${p.district.toUpperCase()} / ${p.type.toUpperCase()} / NIGHT CITY</div>
    <h2 class="detail-name">${p.name}</h2>
    <p class="detail-description">${p.description}</p>
    <div class="detail-meta"><span>ГОСТЕЙ: ${p.capacity}</span><span>СТАТУС: ${availability(p)}</span><span>ЦЕНА: ${money(p.price)} / ночь</span></div>
    <div class="detail-amenities-full"><strong>УДОБСТВА</strong>${p.amenities.map(a => `<span>${a}</span>`).join("")}</div>
   </div>
  </div>
  <div class="detail-actions">
   <button class="primary-btn outline" id="detailBtnBack2">← НАЗАД</button>
   <button class="primary-btn" id="detailBtnBook2">ЗАБРОНИРОВАТЬ <span>↗</span></button>
  </div>
 `;
    $("detailBtnBack").addEventListener("click", () => showPropertyCover(p));
    $("detailBtnBack2").addEventListener("click", () => showPropertyCover(p));
    if (p.isBooked) { $("detailBtnBook2").textContent = "УЖЕ ЗАБРОНИРОВАНО"; $("detailBtnBook2").disabled = true; } else $("detailBtnBook2").addEventListener("click", () => showBookingForm(p));
}
function clearDetailPanel() {
    activeProperty = null; detailPanelTitle.textContent = "ОБЪЕКТ НЕ ВЫБРАН";
    detailPanelBody.innerHTML = `<div class="detail-empty"><span class="empty-mark">—</span>НИЧЕГО НЕ ВЫБРАНО<br>Отметь объект в списке или на карте — здесь появится информация о жилье.</div>`;
}
function openBookingFor(p) {
    activeProperty = p; $("bookingProperty").textContent = `${p.name} · ${p.district} · ${money(p.price)} / ночь`;
    const today = new Date(); today.setDate(today.getDate() + 1); const next = new Date(today); next.setDate(next.getDate() + 2);
    const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    $("checkIn").min = fmt(today); $("checkIn").value = fmt(today); $("checkOut").min = fmt(next); $("checkOut").value = fmt(next); $("guests").value = "2"; $("guestName").value = ""; clearBookingErrors(); updateTotal(); showModal("bookingModal");
}
function updateTotal() {
    if (!$("checkIn").value || !$("checkOut").value || !activeProperty) return;
    const a = new Date($("checkIn").value + "T12:00:00"), b = new Date($("checkOut").value + "T12:00:00"), n = Math.round((b - a) / 86400000);
    if (n > 0) { $("nightsLabel").textContent = `${n} ${n === 1 ? "ночь" : n < 5 ? "ночи" : "ночей"} · ${$("guests").value} гост.`; $("totalPrice").textContent = money(n * activeProperty.price) } else { $("nightsLabel").textContent = "Дата выезда должна быть позже"; $("totalPrice").textContent = "€—" }
}
$("searchInput").addEventListener("input", render); $("districtFilter").addEventListener("change", render); $("typeFilter").addEventListener("change", render); $("guestFilter").addEventListener("change", render); $("priceFilter").addEventListener("input", render);
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => hideModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(m => m.addEventListener("click", e => { if (e.target === m) hideModal(m.id) }));
document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modal-backdrop.open").forEach(m => hideModal(m.id)) });

["checkIn", "checkOut", "guests"].forEach(id => $(id).addEventListener("change", () => { if (id === "checkIn") { $("checkOut").min = $("checkIn").value; if ($("checkOut").value <= $("checkIn").value) $("checkOut").value = ""; } updateTotal() }));
["checkIn", "checkOut", "guests", "guestName"].forEach(id => $(id).addEventListener("input", () => { if (activeProperty) validateBooking("", activeProperty) }));
$("bookingForm").addEventListener("submit", e => {
    e.preventDefault(); if (!activeProperty || activeProperty.isBooked) { setFieldError("guestName", "Этот объект уже забронирован. Выбери другие апартаменты."); return; } const start = new Date($("checkIn").value + "T12:00:00"), end = new Date($("checkOut").value + "T12:00:00"), n = Math.round((end - start) / 86400000), guests = +$("guests").value, name = $("guestName").value.trim();
    if (!validateBooking("", activeProperty)) { return }
    const code = "NCR-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.floor(100 + Math.random() * 900);
    const bk = { id: Date.now(), propertyId: activeProperty.id, propertyName: activeProperty.name, district: activeProperty.district, type: activeProperty.type, price: activeProperty.price, checkIn: $("checkIn").value, checkOut: $("checkOut").value, nights: n, guests, guestName: name, total: n * activeProperty.price, code, status: "active", createdAt: new Date().toISOString() };
    bookings.push(bk); activeProperty.isBooked = true; saveToStorage(); render(); renderBookings();
    hideModal("bookingModal"); $("successText").textContent = `${name}, запрос на ${n} ${n === 1 ? "ночь" : "ночей"} в объекте «${activeProperty.name}» принят. Гостей: ${guests}. Итоговая стоимость: ${money(n * activeProperty.price)}.`;
    $("bookingCode").textContent = code; showModal("successModal");
});
$("zoomIn").addEventListener("click", () => zoom(1.12)); $("zoomOut").addEventListener("click", () => zoom(.89)); $("resetMap").addEventListener("click", () => { zoomLevel = 1; panX = 0; panY = 0; updateMapTransform(); });
let zoomLevel = 1, panX = 0, panY = 0; function zoom(f, cx, cy) { zoomLevel = Math.max(.85, Math.min(1.45, zoomLevel * f)); clampPan(); updateMapTransform() } function updateMapTransform() { $("mapViewport").style.transform = `translate(${panX}px,${panY}px) scale(${zoomLevel})`; $("mapViewport").style.transformOrigin = "center" } function clampPan() { const img = $("mapImage"), mv = $("mapViewport"); const iw = img.clientWidth * zoomLevel, ih = img.clientHeight * zoomLevel; const vw = mv.clientWidth, vh = mv.clientHeight; const overX = Math.min(60, vw * 0.12), overY = Math.min(60, vh * 0.12); const maxX = Math.max(0, (iw - vw) / 2) + overX; const maxY = Math.max(0, (ih - vh) / 2) + overY; panX = Math.max(-maxX, Math.min(maxX, panX)); panY = Math.max(-maxY, Math.min(maxY, panY)); } $("mapViewport").addEventListener("wheel", e => { e.preventDefault(); const f = e.deltaY < 0 ? 1.1 : 0.91; const rect = $("mapViewport").getBoundingClientRect(); const cx = e.clientX - rect.left; const cy = e.clientY - rect.top; const beforeX = (cx - panX) / zoomLevel; const beforeY = (cy - panY) / zoomLevel; zoom(f); const afterX = (cx - panX) / zoomLevel; const afterY = (cy - panY) / zoomLevel; panX += (beforeX - afterX) * zoomLevel; panY += (beforeY - afterY) * zoomLevel; clampPan(); updateMapTransform(); }, { passive: false });
$("profileBtn").addEventListener("click", () => alert("NETRUNNER ID\n\nДемонстрационный профиль пользователя.\nАвторизация не подключена в учебной версии."));
function renderBookings() {
    const container = $("bookingsList");
    if (!bookings.length) { container.innerHTML = `<div class="bookings-empty">В сессии ещё нет броней.<br>Выбери объект и оформи запрос на бронирование — он появится здесь.</div>`; return; }
    container.innerHTML = bookings.map(b => `<article class="booking-card ${b.status}" data-id="${b.id}">
 <div class="booking-card-info"><div class="booking-topline"><span class="booking-code">${b.code}</span><span class="booking-status ${b.status}">${b.status === "active" ? "АКТИВНО" : "ОТМЕНЕНО"}</span></div>
 <h3 class="booking-name">${b.propertyName}</h3><div class="booking-meta">${b.district.toUpperCase()} · ${b.type} · ${b.checkIn} → ${b.checkOut} · ${b.nights} ночь/ей · ${b.guests} гостей</div>
 <div class="booking-guest">Гость: ${b.guestName}</div><div class="booking-total"><span>ИТОГО:</span><strong>${money(b.total)}</strong></div></div>
 <div class="booking-card-actions">${b.status === "active" ? `<button class="btn-cancel" data-id="${b.id}">ОТМЕНИТЬ</button>` : `<span class="btn-cancelled">ОТМЕНЕНО</span>`}<button class="btn-details" data-id="${b.id}">ДЕТАЛИ</button></div></article>`).join("");
    container.querySelectorAll(".btn-cancel").forEach(btn => btn.addEventListener("click", () => cancelBooking(+btn.dataset.id)));
    container.querySelectorAll(".btn-details").forEach(btn => btn.addEventListener("click", () => { const b = bookings.find(x => x.id === +btn.dataset.id); if (b) { selectProperty(b.propertyId, true); detailPanel.scrollIntoView({ behavior: "smooth", block: "start" }); } }));
}
function cancelBooking(id) {
    const b = bookings.find(x => x.id === id);
    if (b && confirm(`Отменить бронирование ${b.code} в объекте «${b.propertyName}»?`)) { b.status = "cancelled"; const bp = properties.find(x => x.id === b.propertyId); if (bp) bp.isBooked = bookings.some(x => x.propertyId === bp.id && x.status === "active"); saveToStorage(); render(); renderBookings(); }
}
function showBookingForm(p) {
    activeProperty = p;
    detailPanelBody.innerHTML = `
  <button class="btn-back" id="detailBtnBackToCover">← НАЗАД К ОБЛОЖКЕ</button>
  <div class="detail-booking">
   <div class="detail-booking-header">
    <div class="detail-topline">${p.district.toUpperCase()} / ${p.type.toUpperCase()} / NIGHT CITY</div>
    <h2 class="detail-name">${p.name}</h2>
    <div class="detail-price"><strong>${money(p.price)}</strong><span>/ ночь</span></div>
   </div>
   <form id="inlineBookingForm" novalidate>
    <div class="form-grid">
     <label>ЗАЕЗД<input type="date" id="inlineCheckIn" required></label>
     <label>ВЫЕЗД<input type="date" id="inlineCheckOut" required></label>
     <label>ГОСТИ<select id="inlineGuests"><option value="1">1 гость</option><option value="2" selected>2 гостя</option><option value="3">3 гостя</option><option value="4">4 гостя</option></select></label>
     <label>ИМЯ БРОНИ<input id="inlineGuestName" type="text" placeholder="Как к вам обращаться?" required maxlength="40"></label>
    </div>
    <div class="price-summary"><span id="inlineNightsLabel">Выберите даты</span><strong id="inlineTotalPrice">€—</strong></div>
    <button class="primary-btn full-btn" type="submit">ПОДТВЕРДИТЬ БРОНЬ <span>↗</span></button>
    <p class="form-note">Демонстрационная бронь. Оплата и реальные персональные данные не запрашиваются.</p>
   </form>
  </div>
 `;
    $("detailBtnBackToCover").addEventListener("click", () => showPropertyCover(p));
    const today = new Date(); today.setDate(today.getDate() + 1); const next = new Date(today); next.setDate(next.getDate() + 2);
    const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    $("inlineCheckIn").min = fmt(today); $("inlineCheckIn").value = fmt(today); $("inlineCheckOut").min = fmt(next); $("inlineCheckOut").value = fmt(next); $("inlineGuests").value = "2"; $("inlineGuestName").value = "";
    clearBookingErrors("inline");
    updateInlineTotal();
    $("inlineCheckIn").addEventListener("change", () => { $("inlineCheckOut").min = $("inlineCheckIn").value; if ($("inlineCheckOut").value <= $("inlineCheckIn").value) $("inlineCheckOut").value = ""; updateInlineTotal(); });
    $("inlineCheckOut").addEventListener("change", updateInlineTotal);
    $("inlineGuests").addEventListener("change", updateInlineTotal);
    ["inlineCheckIn", "inlineCheckOut", "inlineGuests", "inlineGuestName"].forEach(id => $(id).addEventListener("input", () => { if (activeProperty) validateBooking("inline", activeProperty) }));
    $("inlineBookingForm").addEventListener("submit", e => {
        e.preventDefault(); if (!activeProperty || activeProperty.isBooked) { setFieldError("inlineGuestName", "Этот объект уже забронирован. Выбери другие апартаменты."); render(); return; } const start = new Date($("inlineCheckIn").value + "T12:00:00"), end = new Date($("inlineCheckOut").value + "T12:00:00"), n = Math.round((end - start) / 86400000), guests = +$("inlineGuests").value, name = $("inlineGuestName").value.trim();
        if (!validateBooking("inline", activeProperty)) { return }
        const code = "NCR-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + Math.floor(100 + Math.random() * 900);
        const bk = { id: Date.now(), propertyId: activeProperty.id, propertyName: activeProperty.name, district: activeProperty.district, type: activeProperty.type, price: activeProperty.price, checkIn: $("inlineCheckIn").value, checkOut: $("inlineCheckOut").value, nights: n, guests, guestName: name, total: n * activeProperty.price, code, status: "active", createdAt: new Date().toISOString() };
        bookings.push(bk); activeProperty.isBooked = true; saveToStorage(); render(); renderBookings();
        showBookingSuccess(p, n, guests, name, code, n * activeProperty.price);
    });
}
function updateInlineTotal() {
    if (!$("inlineCheckIn").value || !$("inlineCheckOut").value || !activeProperty) return;
    const a = new Date($("inlineCheckIn").value + "T12:00:00"), b = new Date($("inlineCheckOut").value + "T12:00:00"), n = Math.round((b - a) / 86400000);
    if (n > 0) { $("inlineNightsLabel").textContent = `${n} ${n === 1 ? "ночь" : n < 5 ? "ночи" : "ночей"} · ${$("inlineGuests").value} гост.`; $("inlineTotalPrice").textContent = money(n * activeProperty.price) } else { $("inlineNightsLabel").textContent = "Дата выезда должна быть позже"; $("inlineTotalPrice").textContent = "€—"; }
}
function showBookingSuccess(p, n, guests, name, code, total) {
    detailPanelBody.innerHTML = `
  <div class="detail-success">
   <div class="success-icon">✓</div>
   <h2>ТВОЁ МЕСТО<br><span>ЖДЁТ ТЕБЯ.</span></h2>
   <p>${name}, запрос на ${n} ${n === 1 ? "ночь" : n < 5 ? "ночи" : "ночей"} в объекте «${p.name}» принят. Гостей: ${guests}. Итоговая стоимость: ${money(total)}.</p>
   <div class="booking-code">${code}</div>
   <div class="detail-actions">
    <button class="primary-btn" id="detailBtnBackToCover2">← НАЗАД К ОБЛОЖКЕ</button>
    <button class="primary-btn outline" id="detailBtnViewBookings">ПОСМОТРЕТЬ БРОНИ</button>
   </div>
  </div>
 `;
    $("detailBtnBackToCover2").addEventListener("click", () => showPropertyCover(p));
    $("detailBtnViewBookings").addEventListener("click", () => { window.location.hash = "bookings"; const el = $("bookings"); if (el) el.scrollIntoView({ behavior: "smooth" }); });
}
let isDragging = false, startX = 0, startY = 0, startPanX = 0, startPanY = 0; const mv = $("mapViewport"); mv.addEventListener("mousedown", e => { if (e.target.closest(".map-pin")) return; isDragging = true; startX = e.clientX; startY = e.clientY; startPanX = panX; startPanY = panY; mv.style.cursor = "grabbing" }); window.addEventListener("mousemove", e => { if (!isDragging) return; const dx = (e.clientX - startX) / zoomLevel, dy = (e.clientY - startY) / zoomLevel; panX = startPanX + dx; panY = startPanY + dy; clampPan(); updateMapTransform(); }); window.addEventListener("mouseup", () => { isDragging = false; mv.style.cursor = "grab" }); mv.addEventListener("mouseleave", () => { isDragging = false; mv.style.cursor = "grab" });
$("resetDemoBtn").addEventListener("click", () => {
    if (confirm("Сбросить все брони и освободить объекты? Это удалит сохранённые данные демо.")) {
        bookings = [];
        properties.forEach(p => p.isBooked = false);
        localStorage.removeItem(STORAGE_KEY);
        renderBookings();
        render();
    }
});
loadFromStorage();
renderBookings();
render();
clampPan();
updateMapTransform();
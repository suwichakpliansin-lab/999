const LS_KEYS = {
  MENU: "kr_menu",
  ORDERS: "kr_orders",
  USER: "kr_current_user",
  DARK: "kr_dark_mode",
  CART: "kr_cart",
  PENDING_ORDER: "kr_pending_order",
};

// รายชื่อ "นักเรียน" จำลองสำหรับทดสอบระบบล็อกอิน (ในระบบจริงควรตรวจสอบผ่าน Backend/ฐานข้อมูล)
const MOCK_STUDENTS = {
  "24105": "ภัทรชนน ภู่มานะ",
  "24157": "สุวิจักขณ์ เปลี่ยนศิลป์",
  "24202": "ปรัชญา เลิศวุฒิสกุล",
  "29883": "นัธวัฒน์ ระดาชัย",
  "24275": "จิรายุ แก้วแกมทอง",
  "29887": "เจษฎา ดวงภูมิเมธ",
  "29871": "วรพล ธนวัฒวรเดโช",
  "29855": "จิราภัทร แดงขาว",
  "29823": "นฤดล ปรีดา",
  "26140": "รพีพงษ์ ศรีสัมพันธ์",
  "24228": "ฉัตรดนัย เขียวรัมย์",
};
const ADMIN_ID = "admin";

/* หมวดหมู่อาหาร */
const CATEGORIES = [
  { id: "all", name: "ทั้งหมด", icon: "🍽️" },
  { id: "rice", name: "อาหารจานเดียว", icon: "🍚" },
  { id: "noodle", name: "ก๋วยเตี๋ยว/เส้น", icon: "🍜" },
  { id: "snack", name: "ของว่าง", icon: "🍟" },
  { id: "drink", name: "เครื่องดื่ม", icon: "🥤" },
  { id: "dessert", name: "ของหวาน", icon: "🍰" },
];

/* เมนูอาหารเริ่มต้น (ใช้ครั้งแรกที่ยังไม่มีข้อมูลใน LocalStorage) */
const DEFAULT_MENU = [
  { id: "m1", name: "ผัดกะเพราหมูสับไข่ดาว", desc: "ผัดกะเพราหมูสับรสจัดจ้าน เสิร์ฟพร้อมข้าวสวยร้อนๆ และไข่ดาว", category: "rice", price: 45, img: "images/rice_krapow.png", available: true },
  { id: "m2", name: "ข้าวมันไก่", desc: "ไก่ต้มนุ่มฉ่ำ ข้าวมันหอมมัน เสิร์ฟพร้อมน้ำจิ้มสูตรพิเศษ", category: "rice", price: 40, img: "images/chicken_rice.jpeg", available: true },
  { id: "m3", name: "ข้าวผัดหมู", desc: "ข้าวผัดหอมกลิ่นกระทะ เครื่องแน่น หมูนุ่ม", category: "rice", price: 40, img: "images/rice_pork.jpeg", available: true },
  { id: "m4", name: "ก๋วยเตี๋ยวต้มยำหมู", desc: "รสจัดจ้านเปรี้ยวเผ็ด เส้นเหนียวนุ่ม หมูสไลซ์คุณภาพ", category: "noodle", price: 50, img: "images/noodle_tomyum.jpeg", available: true },
  { id: "m5", name: "บะหมี่หมูแดง", desc: "บะหมี่เหลืองเหนียวนุ่ม หมูแดงหอมหวาน น้ำซุปกลมกล่อม", category: "noodle", price: 45, img: "images/noodle_mudang.jpeg", available: true },
  { id: "m6", name: "เกี๊ยวซ่าทอด", desc: "เกี๊ยวซ่าไส้แน่น ทอดกรอบเสิร์ฟพร้อมน้ำจิ้ม", category: "snack", price: 35, img: "images/za_za.webp", available: true },
  { id: "m7", name: "เฟรนช์ฟรายส์ชีส", desc: "มันฝรั่งทอดกรอบราดชีสหอมมัน", category: "snack", price: 35, img: "images/french_firescheese.jpeg", available: false },
  { id: "m8", name: "ชานมไข่มุก", desc: "ชานมหอมกลมกล่อม ไข่มุกเหนียวนุ่ม หวานมันลงตัว", category: "drink", price: 30, img: "images/cha_nom.jpeg", available: true },
  { id: "m9", name: "น้ำส้มคั้นสด", desc: "น้ำส้มคั้นสดใหม่ 100% ไม่ใส่น้ำตาล", category: "drink", price: 25, img: "images/orange_juice.jpeg", available: true },
  { id: "m10", name: "ไอศกรีมวานิลา", desc: "ไอศกรีมวานิลลาเนื้อเนียนละมุน", category: "drink", price: 25, img: "images/icecream_valila.jpeg", available: true },
  { id: "m12", name: "ส้มตำไทย", desc: "ส้มตำรสแซ่บ เปรี้ยวเผ็ดหวานลงตัว", category: "rice", price: 35, img: "images/som_tum.jpeg", available: true },
];

/* ---------------------------------------------------------------------
   2) State หลักของแอป
--------------------------------------------------------------------- */
let state = {
  currentUser: null,      // { id, name, isAdmin }
  menu: [],
  orders: [],
  cart: [],               // [{menuId, qty, note}]
  activeCategory: "all",
  searchTerm: "",
  activeFoodId: null,     // เมนูที่กำลังเปิดดูรายละเอียดอยู่
  pendingOrder: null,     // ออเดอร์ที่รอชำระเงิน
  paymentTimerInterval: null,
  editingMenuId: null,    // สำหรับแอดมิน: กำลังแก้ไขเมนูไหนอยู่
};

/* ---------------------------------------------------------------------
   3) Helper: LocalStorage
--------------------------------------------------------------------- */
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveToStorage(key, value) {
 localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------------------------------------------------------------
   4) Helper: รูปแบบตัวเลข/เงิน/วันที่
--------------------------------------------------------------------- */
function formatMoney(num) {
  return "฿" + Number(num).toLocaleString("th-TH", { maximumFractionDigits: 0 });
}
function formatThaiDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
}
function pad2(n) { return n.toString().padStart(2, "0"); }

/* ---------------------------------------------------------------------
   5) Toast แจ้งเตือน
--------------------------------------------------------------------- */
let toastTimeout = null;
function showToast(message, type = "default") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show" + (type === "error" ? " toast-error" : type === "success" ? " toast-success" : "");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.classList.remove("show"); }, 2600);
}

/* ---------------------------------------------------------------------
   6) เริ่มต้นแอป
--------------------------------------------------------------------- */
function initApp() {
  // โหลดเมนู: ถ้ายังไม่เคยมีข้อมูล ให้ใช้ค่าเริ่มต้น
  state.menu = loadFromStorage(LS_KEYS.MENU, null) || DEFAULT_MENU;
  saveToStorage(LS_KEYS.MENU, state.menu);

  state.orders = loadFromStorage(LS_KEYS.ORDERS, []);
state.cart = loadFromStorage(LS_KEYS.CART, []);
state.pendingOrder = loadFromStorage(LS_KEYS.PENDING_ORDER, null);
console.log("pendingOrder =", state.pendingOrder);

  // โหมดมืด
  const darkMode = loadFromStorage(LS_KEYS.DARK, false);
  if (darkMode) {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").textContent = "☀️";
  }

  // เติมหมวดหมู่ในหน้าแรกและในฟอร์มแอดมิน
  renderCategoryBar();
  renderMenuFormCategoryOptions();

  // ตรวจสอบว่ามีผู้ใช้ล็อกอินค้างอยู่หรือไม่
  const savedUser = loadFromStorage(LS_KEYS.USER, null);
  if (savedUser) {
    state.currentUser = savedUser;
    enterApp();
  }

  bindEvents();
}

/* ---------------------------------------------------------------------
   7) ระบบเข้าสู่ระบบ
--------------------------------------------------------------------- */
function handleLogin(e) {
  e.preventDefault();
  const input = document.getElementById("studentId");
  const errorEl = document.getElementById("loginError");
  const id = input.value.trim();

  if (!id) {
    errorEl.textContent = "กรุณากรอกเลขประจำตัวนักเรียน";
    return;
  }

  let user = null;
  if (id.toLowerCase() === ADMIN_ID) {
    user = { id: "admin", name: "ผู้ดูแลระบบ", isAdmin: true };
  } else if (MOCK_STUDENTS[id]) {
    user = { id, name: MOCK_STUDENTS[id], isAdmin: false };
  }

  if (!user) {
    errorEl.textContent = "ไม่พบเลขประจำตัวนี้ในระบบ กรุณาตรวจสอบอีกครั้ง";
    return;
  }

  errorEl.textContent = "";
  state.currentUser = user;
  saveToStorage(LS_KEYS.USER, user);
  enterApp();
}

function enterApp() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("userName").textContent = state.currentUser.name;

  if (state.currentUser.isAdmin) {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
  }

  renderFoodGrid();
  renderCart();
  renderHistory();
  if (state.currentUser.isAdmin) {
    renderAdminMenuTable();
    renderAdminOrderTable();
    renderAdminStats();
  }
 if (localStorage.getItem("stripe_paid") === "true") {

    localStorage.removeItem("stripe_paid");

    const order = state.pendingOrder;

    if (order) {

        state.orders.unshift(order);
        saveToStorage(LS_KEYS.ORDERS, state.orders);

        state.cart = [];
        saveToStorage(LS_KEYS.CART, state.cart);

        state.pendingOrder = null;
        saveToStorage(LS_KEYS.PENDING_ORDER, null);

        renderCart();
        renderHistory();

        showToast("ชำระเงินสำเร็จ 🎉", "success");

        switchView("history");
        return;
    }
} 
 switchView("home");
}

function handleLogout() {
  state.currentUser = null;
  localStorage.removeItem(LS_KEYS.USER);
  document.getElementById("app").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("studentId").value = "";
}

/* ---------------------------------------------------------------------
   8) สลับหน้า (Home / History / Admin)
--------------------------------------------------------------------- */
function switchView(viewName) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.getElementById("view-" + viewName).classList.remove("hidden");

  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  if (viewName === "history") renderHistory();
  if (viewName === "admin") {
    renderAdminMenuTable();
    renderAdminOrderTable();
    renderAdminStats();
  }
}

/* ---------------------------------------------------------------------
   9) หน้าแรก: หมวดหมู่ + รายการอาหาร + ค้นหา
--------------------------------------------------------------------- */
function renderCategoryBar() {
  const bar = document.getElementById("categoryBar");
  bar.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-chip" + (state.activeCategory === cat.id ? " active" : "");
    btn.textContent = `${cat.icon} ${cat.name}`;
    btn.addEventListener("click", () => {
      state.activeCategory = cat.id;
      renderCategoryBar();
      renderFoodGrid();
    });
    bar.appendChild(btn);
  });
}

function getFilteredMenu() {
  return state.menu.filter(item => {
    const matchCategory = state.activeCategory === "all" || item.category === state.activeCategory;
    const matchSearch = item.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         item.desc.toLowerCase().includes(state.searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });
}

function renderFoodGrid() {
  const grid = document.getElementById("foodGrid");
  const noResult = document.getElementById("noResult");
  const filtered = getFilteredMenu();

  grid.innerHTML = "";
  noResult.classList.toggle("hidden", filtered.length > 0);

  filtered.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.style.animationDelay = (i * 0.03) + "s";
    card.innerHTML = `
      <div class="food-card-img-wrap">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <span class="food-status ${item.available ? "available" : "soldout"}">${item.available ? "พร้อมขาย" : "หมด"}</span>
      </div>
      <div class="food-card-body">
        <h3>${item.name}</h3>
        <p class="food-card-desc">${item.desc}</p>
        <div class="food-card-footer">
          <span class="food-price">${formatMoney(item.price)}</span>
          <button class="order-btn" data-food-id="${item.id}" ${item.available ? "" : "disabled"}>
            ${item.available ? "สั่งอาหาร" : "หมดแล้ว"}
          </button>
        </div>
      </div>
    `;
    // เปิดดูรายละเอียดเมื่อคลิกที่การ์ด
    card.addEventListener("click", (e) => {
      if (e.target.closest(".order-btn")) return; // ปุ่มสั่งอาหารจัดการแยก
      openFoodModal(item.id);
    });
    grid.appendChild(card);
  });

  // ปุ่ม "สั่งอาหาร" เปิด modal รายละเอียดเช่นกัน (ให้เลือกจำนวน/หมายเหตุก่อนเพิ่มตะกร้า)
  grid.querySelectorAll(".order-btn").forEach(btn => {
    btn.addEventListener("click", () => openFoodModal(btn.dataset.foodId));
  });
}

/* ---------------------------------------------------------------------
   10) Modal รายละเอียดอาหาร
--------------------------------------------------------------------- */
let currentQty = 1;

function openFoodModal(foodId) {
  const item = state.menu.find(m => m.id === foodId);
  if (!item || !item.available) return;

  state.activeFoodId = foodId;
  currentQty = 1;

  document.getElementById("foodModalImg").src = item.img;
  document.getElementById("foodModalImg").alt = item.name;
  document.getElementById("foodModalName").textContent = item.name;
  document.getElementById("foodModalDesc").textContent = item.desc;
  document.getElementById("foodModalPrice").textContent = formatMoney(item.price);
  document.getElementById("qtyValue").textContent = currentQty;
  document.getElementById("foodNote").value = "";

  openModal("foodModal");
}

function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById("qtyValue").textContent = currentQty;
}

function handleAddToCart() {
  const item = state.menu.find(m => m.id === state.activeFoodId);
  if (!item) return;
  const note = document.getElementById("foodNote").value.trim();

  // ถ้ามีเมนูเดิมพร้อมหมายเหตุเดียวกันอยู่แล้ว ให้รวมจำนวน ไม่เช่นนั้นเพิ่มรายการใหม่
  const existing = state.cart.find(c => c.menuId === item.id && c.note === note);
  if (existing) {
    existing.qty += currentQty;
  } else {
    state.cart.push({ menuId: item.id, qty: currentQty, note });
  }

  saveToStorage(LS_KEYS.CART, state.cart);
  renderCart();
  closeModal("foodModal");
  showToast(`เพิ่ม "${item.name}" ลงตะกร้าแล้ว 🛒`, "success");
}

/* ---------------------------------------------------------------------
   11) ตะกร้าสินค้า
--------------------------------------------------------------------- */
function getCartDetailed() {
  return state.cart
    .map(c => {
      const menuItem = state.menu.find(m => m.id === c.menuId);
      if (!menuItem) return null;
      return { ...c, menuItem, lineTotal: menuItem.price * c.qty };
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartDetailed().reduce((sum, c) => sum + c.lineTotal, 0);
}

function renderCart() {
  const wrap = document.getElementById("cartItemsWrap");
  const emptyMsg = document.getElementById("cartEmptyMsg");
  const detailed = getCartDetailed();

  const totalQty = detailed.reduce((s, c) => s + c.qty, 0);
  const cartCountEl = document.getElementById("cartCount");
  cartCountEl.textContent = totalQty;
  cartCountEl.classList.toggle("hidden", totalQty === 0);

  wrap.innerHTML = "";
  emptyMsg.classList.toggle("hidden", detailed.length > 0);

  detailed.forEach((c, idx) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${c.menuItem.img}" alt="${c.menuItem.name}">
      <div class="cart-item-info">
        <h4>${c.menuItem.name}</h4>
        ${c.note ? `<div class="cart-item-note">หมายเหตุ: ${c.note}</div>` : ""}
        <div class="cart-item-price">${formatMoney(c.lineTotal)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="qty-btn" data-action="dec" data-idx="${idx}">−</button>
          <span>${c.qty}</span>
          <button class="qty-btn" data-action="inc" data-idx="${idx}">+</button>
        </div>
        <button class="cart-item-remove" data-action="remove" data-idx="${idx}">🗑️</button>
      </div>
    `;
    wrap.appendChild(row);
  });

  document.getElementById("cartTotalPrice").textContent = formatMoney(getCartTotal());

  wrap.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const action = btn.dataset.action;
      const detailedItems = getCartDetailed();
      const targetCartIdx = state.cart.indexOf(detailedItems[idx]);

      if (action === "inc") state.cart[idx].qty += 1;
      if (action === "dec") {
        state.cart[idx].qty -= 1;
        if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
      }
      if (action === "remove") state.cart.splice(idx, 1);

      saveToStorage(LS_KEYS.CART, state.cart);
      renderCart();
    });
  });
}

/* ---------------------------------------------------------------------
   12) เลือกวันเวลารับอาหาร
--------------------------------------------------------------------- */
function openPickupModal() {
  if (state.cart.length === 0) {
    showToast("ตะกร้าว่างเปล่า กรุณาเลือกเมนูก่อน", "error");
    return;
  }
  closeModal("cartModal");

  const dateInput = document.getElementById("pickupDate");
  const timeInput = document.getElementById("pickupTime");
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  dateInput.min = todayStr;
  if (!dateInput.value) dateInput.value = todayStr;

  document.getElementById("pickupError").textContent = "";
  document.getElementById("estimateReadyMsg").classList.add("hidden");

  openModal("pickupModal");
}

function isPickupTimeValid(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;
  const selected = new Date(`${dateStr}T${timeStr}`);
  return selected.getTime() > Date.now();
}

function updateEstimate() {
  const dateStr = document.getElementById("pickupDate").value;
  const timeStr = document.getElementById("pickupTime").value;
  const estimateEl = document.getElementById("estimateReadyMsg");

  if (isPickupTimeValid(dateStr, timeStr)) {
    estimateEl.textContent = `⏱️ อาหารจะพร้อมเสิร์ฟประมาณ ${timeStr} น. ของวันที่ ${formatThaiDate(dateStr)}`;
    estimateEl.classList.remove("hidden");
  } else {
    estimateEl.classList.add("hidden");
  }
}

function handleConfirmPickup() {
  const dateStr = document.getElementById("pickupDate").value;
  const timeStr = document.getElementById("pickupTime").value;
  const errorEl = document.getElementById("pickupError");

  if (!dateStr || !timeStr) {
    errorEl.textContent = "กรุณาเลือกวันและเวลารับอาหาร";
    return;
  }
  if (!isPickupTimeValid(dateStr, timeStr)) {
    errorEl.textContent = "ไม่สามารถเลือกเวลาในอดีตได้ กรุณาเลือกใหม่";
    return;
  }
  errorEl.textContent = "";

  // สร้างออเดอร์ที่ "รอชำระเงิน" ไว้ก่อน ยังไม่บันทึกเข้าประวัติจนกว่าจะจ่ายเงินสำเร็จ
  const detailed = getCartDetailed();
  state.pendingOrder = {
    id: "ORD" + Date.now().toString().slice(-8),
    userId: state.currentUser.id,
    userName: state.currentUser.name,
   items: detailed.map(c => ({
    name: c.menuItem.name,
    qty: c.qty,
    price: c.menuItem.price,
    note: c.note
})),
    total: getCartTotal(),
    pickupDate: dateStr,
    pickupTime: timeStr,
    createdAt: new Date().toISOString(),
    status: "waiting",
};

saveToStorage(LS_KEYS.PENDING_ORDER, state.pendingOrder);

closeModal("pickupModal");
openPaymentModal();
}

/* ---------------------------------------------------------------------
   13) ชำระเงินด้วย QR Code (จำลอง)
--------------------------------------------------------------------- */
let paymentSecondsLeft = 300; // 5 นาที

async function openPaymentModal() {
    const order = state.pendingOrder;
    if (!order) return;

    document.getElementById("payOrderId").textContent = order.id;
    document.getElementById("payAmount").textContent = formatMoney(order.total);

    const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: order.total * 100
        })
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    window.location.href = data.url;
}

function updatePaymentTimerDisplay() {
  const min = Math.floor(paymentSecondsLeft / 60);
  const sec = paymentSecondsLeft % 60;
  document.getElementById("payTimer").textContent = `${pad2(min)}:${pad2(sec)}`;
}

function handleSimulatePayment() {
  const order = state.pendingOrder;
  if (!order) return;

  clearInterval(state.paymentTimerInterval);

  // บันทึกออเดอร์ลงประวัติ พร้อมเปลี่ยนสถานะเป็น "รอรับออเดอร์"
  state.orders.unshift(order);
  saveToStorage(LS_KEYS.ORDERS, state.orders);

  // ล้างตะกร้าเนื่องจากชำระเงินสำเร็จแล้ว
  state.cart = [];
  saveToStorage(LS_KEYS.CART, state.cart);
  state.pendingOrder = null;

  closeModal("paymentModal");
  renderCart();
  renderHistory();
  if (state.currentUser.isAdmin) { renderAdminOrderTable(); renderAdminStats(); }

  showToast("ชำระเงินสำเร็จ! คำสั่งซื้อของคุณถูกส่งแล้ว 🎉", "success");
  switchView("history");
}

function handleCancelPayment() {
  clearInterval(state.paymentTimerInterval);
  state.pendingOrder = null;
  closeModal("paymentModal");
  showToast("ยกเลิกคำสั่งซื้อแล้ว");
}

/* ---------------------------------------------------------------------
   14) ประวัติการสั่งซื้อ
--------------------------------------------------------------------- */
const STATUS_LABELS = {
  waiting: { text: "รอรับออเดอร์", cls: "status-waiting" },
  cooking: { text: "กำลังทำอาหาร", cls: "status-cooking" },
  ready: { text: "พร้อมรับ", cls: "status-ready" },
  completed: { text: "รับอาหารแล้ว", cls: "status-completed" },
  cancelled: { text: "ยกเลิก", cls: "status-cancelled" },
};

function renderHistory() {
  if (!state.currentUser) return;
  const list = document.getElementById("historyList");
  const noHistory = document.getElementById("noHistory");

  const myOrders = state.currentUser.isAdmin
    ? state.orders
    : state.orders.filter(o => o.userId === state.currentUser.id);

  list.innerHTML = "";
  noHistory.classList.toggle("hidden", myOrders.length > 0);

  myOrders.forEach(order => {
    const statusInfo = STATUS_LABELS[order.status];
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <div class="history-card-top">
        <div>
          <div class="history-order-id">#${order.id}</div>
          <div class="history-date">${new Date(order.createdAt).toLocaleString("th-TH")}</div>
        </div>
        <span class="status-badge ${statusInfo.cls}">${statusInfo.text}</span>
      </div>
      <div class="history-items">
        ${order.items.map(it => `${it.name} × ${it.qty}${it.note ? ` (${it.note})` : ""}`).join("<br>")}
      </div>
      <div class="history-bottom">
        <span class="history-pickup">📅 รับ ${formatThaiDate(order.pickupDate)} เวลา ${order.pickupTime} น.</span>
        <span class="history-total">${formatMoney(order.total)}</span>
      </div>
    `;
    list.appendChild(card);
  });
}

/* ---------------------------------------------------------------------
   15) ระบบแอดมิน: สถิติ
--------------------------------------------------------------------- */
function renderAdminStats() {
  const validOrders = state.orders.filter(o => o.status !== "cancelled");
  const revenue = validOrders.reduce((s, o) => s + o.total, 0);

  document.getElementById("statRevenue").textContent = formatMoney(revenue);
  document.getElementById("statOrders").textContent = validOrders.length;

  // หาเมนูขายดีที่สุดจากออเดอร์ทั้งหมด
  const itemCount = {};
  validOrders.forEach(o => o.items.forEach(it => {
    itemCount[it.name] = (itemCount[it.name] || 0) + it.qty;
  }));
  const top = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("statTopItem").textContent = top ? `${top[0]} (${top[1]})` : "-";
}

/* ---------------------------------------------------------------------
   16) ระบบแอดมิน: จัดการเมนู
--------------------------------------------------------------------- */
function renderMenuFormCategoryOptions() {
  const select = document.getElementById("menuFormCategory");
  select.innerHTML = CATEGORIES.filter(c => c.id !== "all")
    .map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
}

function getCategoryName(catId) {
  const found = CATEGORIES.find(c => c.id === catId);
  return found ? found.name : catId;
}

function renderAdminMenuTable() {
  const tbody = document.getElementById("adminMenuTableBody");
  tbody.innerHTML = "";

  state.menu.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${item.img}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>${getCategoryName(item.category)}</td>
      <td>${formatMoney(item.price)}</td>
      <td><span class="status-badge ${item.available ? "status-ready" : "status-cancelled"}">${item.available ? "พร้อมขาย" : "ปิดขาย"}</span></td>
      <td>
        <button class="table-action-btn edit" data-id="${item.id}" data-action="edit">แก้ไข</button>
        <button class="table-action-btn toggle" data-id="${item.id}" data-action="toggle">${item.available ? "ปิดขาย" : "เปิดขาย"}</button>
        <button class="table-action-btn delete" data-id="${item.id}" data-action="delete">ลบ</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => handleAdminMenuAction(btn.dataset.id, btn.dataset.action));
  });
}

function handleAdminMenuAction(id, action) {
  const item = state.menu.find(m => m.id === id);
  if (!item) return;

  if (action === "edit") openMenuForm(item);
  if (action === "toggle") {
    item.available = !item.available;
    saveToStorage(LS_KEYS.MENU, state.menu);
    renderAdminMenuTable();
    renderFoodGrid();
    showToast(`${item.available ? "เปิดขาย" : "ปิดขาย"} "${item.name}" แล้ว`, "success");
  }
  if (action === "delete") {
    if (!confirm(`ต้องการลบเมนู "${item.name}" ใช่หรือไม่?`)) return;
    state.menu = state.menu.filter(m => m.id !== id);
    saveToStorage(LS_KEYS.MENU, state.menu);
    renderAdminMenuTable();
    renderFoodGrid();
    showToast("ลบเมนูเรียบร้อยแล้ว", "success");
  }
}

function openMenuForm(item) {
  state.editingMenuId = item ? item.id : null;
  document.getElementById("menuFormTitle").textContent = item ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่";
  document.getElementById("menuFormId").value = item ? item.id : "";
  document.getElementById("menuFormName").value = item ? item.name : "";
  document.getElementById("menuFormDesc").value = item ? item.desc : "";
  document.getElementById("menuFormCategory").value = item ? item.category : CATEGORIES[1].id;
  document.getElementById("menuFormPrice").value = item ? item.price : "";
  document.getElementById("menuFormImg").value = item ? item.img : "";
  document.getElementById("menuFormAvailable").checked = item ? item.available : true;
  openModal("menuFormModal");
}

function handleMenuFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("menuFormId").value;
  const name = document.getElementById("menuFormName").value.trim();
  const desc = document.getElementById("menuFormDesc").value.trim();
  const category = document.getElementById("menuFormCategory").value;
  const price = Number(document.getElementById("menuFormPrice").value);
  const img = document.getElementById("menuFormImg").value.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
  const available = document.getElementById("menuFormAvailable").checked;

  if (id) {
    // แก้ไขเมนูเดิม
    const item = state.menu.find(m => m.id === id);
    Object.assign(item, { name, desc, category, price, img, available });
    showToast("แก้ไขเมนูเรียบร้อยแล้ว", "success");
  } else {
    // เพิ่มเมนูใหม่
    state.menu.push({ id: "m" + Date.now(), name, desc, category, price, img, available });
    showToast("เพิ่มเมนูใหม่เรียบร้อยแล้ว", "success");
  }

  saveToStorage(LS_KEYS.MENU, state.menu);
  renderAdminMenuTable();
  renderFoodGrid();
  closeModal("menuFormModal");
}

/* ---------------------------------------------------------------------
   17) ระบบแอดมิน: จัดการออเดอร์
--------------------------------------------------------------------- */
function renderAdminOrderTable() {
  const tbody = document.getElementById("adminOrderTableBody");
  tbody.innerHTML = "";

  state.orders.forEach(order => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.userName}</td>
      <td>${formatThaiDate(order.pickupDate)} ${order.pickupTime}</td>
      <td>${formatMoney(order.total)}</td>
      <td><span class="status-badge ${STATUS_LABELS[order.status].cls}">${STATUS_LABELS[order.status].text}</span></td>
      <td>
        <select class="order-status-select" data-id="${order.id}">
          ${Object.entries(STATUS_LABELS).map(([key, val]) =>
            `<option value="${key}" ${order.status === key ? "selected" : ""}>${val.text}</option>`
          ).join("")}
        </select>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".order-status-select").forEach(sel => {
    sel.addEventListener("change", () => {
      const order = state.orders.find(o => o.id === sel.dataset.id);
      order.status = sel.value;
      saveToStorage(LS_KEYS.ORDERS, state.orders);
      renderAdminStats();
      showToast(`อัปเดตสถานะออเดอร์ #${order.id} แล้ว`, "success");
    });
  });
}

/* ---------------------------------------------------------------------
   18) Modal ทั่วไป: เปิด/ปิด
--------------------------------------------------------------------- */
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

/* ---------------------------------------------------------------------
   19) โหมดมืด
--------------------------------------------------------------------- */
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  document.getElementById("darkModeToggle").textContent = isDark ? "☀️" : "🌙";
  saveToStorage(LS_KEYS.DARK, isDark);
}

/* ---------------------------------------------------------------------
   20) ผูก Event ทั้งหมด
--------------------------------------------------------------------- */
function bindEvents() {
  // ล็อกอิน / ล็อกเอาต์
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("logoutBtn").addEventListener("click", handleLogout);

  // นำทาง
  document.getElementById("navCenter").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-link");
    if (btn) switchView(btn.dataset.view);
  });

  // โหมดมืด
  document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);

  // ค้นหาอาหาร
  document.getElementById("searchInput").addEventListener("input", (e) => {
    state.searchTerm = e.target.value;
    renderFoodGrid();
  });

  // Modal รายละเอียดอาหาร
  document.getElementById("qtyMinus").addEventListener("click", () => changeQty(-1));
  document.getElementById("qtyPlus").addEventListener("click", () => changeQty(1));
  document.getElementById("addToCartBtn").addEventListener("click", handleAddToCart);

  // ตะกร้า
  document.getElementById("cartBtn").addEventListener("click", () => openModal("cartModal"));
  document.getElementById("goToPickupBtn").addEventListener("click", openPickupModal);

  // เวลารับอาหาร
  document.getElementById("pickupDate").addEventListener("change", updateEstimate);
  document.getElementById("pickupTime").addEventListener("change", updateEstimate);
  document.getElementById("confirmPickupBtn").addEventListener("click", handleConfirmPickup);

  // ชำระเงิน QR
  document.getElementById("simulatePayBtn").addEventListener("click", handleSimulatePayment);
  document.getElementById("cancelPayBtn").addEventListener("click", handleCancelPayment);

  // แอดมิน: แท็บ
  document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.add("hidden"));
      document.getElementById("adminTab-" + btn.dataset.admintab).classList.remove("hidden");
    });
  });

  // แอดมิน: ฟอร์มเมนู
  document.getElementById("addMenuBtn").addEventListener("click", () => openMenuForm(null));
  document.getElementById("menuForm").addEventListener("submit", handleMenuFormSubmit);

  // ปิด Modal ทั้งหมด (ปุ่ม X และคลิกพื้นหลัง)
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        // ห้ามปิด Modal ชำระเงินด้วยการคลิกพื้นหลัง เพื่อป้องกันการปิดโดยไม่ตั้งใจระหว่างจ่ายเงิน
        if (overlay.id === "paymentModal") return;
        overlay.classList.add("hidden");
      }
    });
  });
}

/* ---------------------------------------------------------------------
   21) จุดเชื่อมต่อ Backend ในอนาคต (ตัวอย่างโครงสร้างฟังก์ชัน)
   -------------------------------------------------------------------
   เมื่อมี Backend จริง สามารถแทนที่ฟังก์ชัน loadFromStorage/saveToStorage
   ด้วยการเรียก fetch() ไปยัง REST API ได้ เช่น:

   async function fetchMenuFromServer() {
     const res = await fetch("/api/menu");
     return await res.json();
   }
   async function submitOrderToServer(order) {
     const res = await fetch("/api/orders", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(order),
     });
     return await res.json();
   }
--------------------------------------------------------------------- */

/* ---------------------------------------------------------------------
   22) เริ่มการทำงานเมื่อโหลดหน้าเว็บเสร็จ
--------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", initApp);
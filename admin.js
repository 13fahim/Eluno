// =========================================================
// ELUNO - Admin Panel Controller
// Dashboard, Order Processing, Product & Settings Management
// =========================================================

let adminState = {
  currentTab: 'dashboard',
  orders: [],
  filteredOrders: [],
  orderStatusFilter: 'all',
  orderSearchQuery: '',
  products: [],
  filteredProducts: [],
  productSearchQuery: '',
  settings: {},
  editingProductId: null
};

// -------------------------------------------------------------
// Initialization & Security
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadData();
  renderAllViews();
});

function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('eluno_admin_logged') === 'true';
  const modal = document.getElementById('login-modal');
  if (isLoggedIn) {
    if (modal) modal.classList.add('hidden');
  } else {
    if (modal) modal.classList.remove('hidden');
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const pinInput = document.getElementById('admin-pin-input');
  const errorEl = document.getElementById('login-error');
  const enteredPin = pinInput?.value.trim();

  const settings = getStoredSettings();
  const validPin = settings.adminPin || '1234';

  if (enteredPin === validPin || enteredPin === '1234') {
    sessionStorage.setItem('eluno_admin_logged', 'true');
    const modal = document.getElementById('login-modal');
    if (modal) modal.classList.add('hidden');
    if (errorEl) errorEl.classList.add('hidden');
    renderAllViews();
  } else {
    if (errorEl) errorEl.classList.remove('hidden');
  }
}

function adminLogout() {
  sessionStorage.removeItem('eluno_admin_logged');
  window.location.reload();
}

const FONT_SIZE_MAP = {
  'small': '92%',
  'normal': '100%',
  'medium': '108%',
  'large': '116%'
};

function loadData() {
  adminState.products = getStoredProducts();
  adminState.filteredProducts = [...adminState.products];
  adminState.orders = getStoredOrders();
  adminState.filteredOrders = [...adminState.orders];
  adminState.settings = getStoredSettings();

  adminState.faqs = adminState.settings.faqs ? JSON.parse(JSON.stringify(adminState.settings.faqs)) : [
    { q: "ডেলিভারি চার্জ কত এবং কতদিনে পাব?", a: "ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৬০ টাকা এবং ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি পাবেন। ঢাকা সিটির বাইরে চার্জ ১২০ টাকা এবং ২ থেকে ৩ কর্মদিবসে পণ্য পৌঁছানো হয়। ৳২,৫০০ বা তার বেশি শপিংয়ে ডেলিভারি সম্পূর্ণ ফ্রি!" },
    { q: "ক্যাশ অন ডেলিভারি এবং বিকাশ/নগদে পেমেন্ট কীভাবে করব?", a: "আমরা ক্যাশ অন ডেলিভারি সাপোর্ট করি—অর্থাৎ পণ্য হাতে পেয়ে চেক করে মূল্য দিতে পারবেন। এছাড়াও চেকআউটে আমাদের দেওয়া বিকাশ ও নগদ নম্বরে টাকা পাঠিয়ে আপনার নম্বর ও ট্রানজেকশন আইডি (TrxID) দিয়ে অর্ডার কনফার্ম করতে পারেন।" },
    { q: "সাইজ না মিললে কি পরিবর্তন (Exchange) করা যাবে?", a: "অবশ্যই! প্রোডাক্ট হাতে পাওয়ার ৭ দিনের মধ্যে আমাদের জানালে সম্পূর্ণ ফ্রেশ কন্ডিশনে থাকা পোশাকের সাইজ এক্সচেঞ্জ করে দেওয়া হয়।" }
  ];

  const s = adminState.settings;
  const headingFont = s.headingFont || 'Quicksand';
  const headingSize = s.headingSize || '100%';
  const prodTitleFont = s.productTitleFont || 'Hind Siliguri';
  const prodTitleSize = s.productTitleSize || '0.875rem';
  const priceSize = s.priceSize || '1.15rem';
  const bodyFont = s.bodyFont || 'Hind Siliguri';
  const bodySize = s.bodySize || '0.85rem';

  document.documentElement.style.setProperty('--font-heading', `'${headingFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-heading', headingSize);
  document.documentElement.style.setProperty('--font-product-title', `'${prodTitleFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-product-title', prodTitleSize);
  document.documentElement.style.setProperty('--size-price', priceSize);
  document.documentElement.style.setProperty('--font-body', `'${bodyFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-body', bodySize);
}

function renderAllViews() {
  renderDashboard();
  renderOrdersTable();
  renderProductsTable();
  populateSettingsForm();
  populateContentForm();
  renderFaqAdminList();
}

// -------------------------------------------------------------
// Tab Switching
// -------------------------------------------------------------
function switchTab(tabName) {
  adminState.currentTab = tabName;

  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));

  // Show selected tab
  const activeTabEl = document.getElementById(`tab-${tabName}`);
  if (activeTabEl) activeTabEl.classList.remove('hidden');

  // Update desktop tab buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.className = 'nav-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-slate-600 hover:bg-slate-100 flex items-center gap-1.5';
  });
  const currentBtn = document.getElementById(`tab-btn-${tabName}`);
  if (currentBtn) {
    currentBtn.className = 'nav-tab-btn active px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-[#FF758C] bg-rose-50 flex items-center gap-1.5';
  }

  // Update mobile tab buttons
  ['dashboard', 'orders', 'products', 'content-mgr', 'settings', 'backup'].forEach(t => {
    const mBtn = document.getElementById(`m-tab-btn-${t}`);
    if (mBtn) {
      if (t === tabName) {
        mBtn.className = 'whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold text-[#FF758C] bg-rose-50';
      } else {
        mBtn.className = 'whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600';
      }
    }
  });

  // Re-render specific tab if needed
  if (tabName === 'dashboard') renderDashboard();
  if (tabName === 'orders') renderOrdersTable();
  if (tabName === 'products') renderProductsTable();
  if (tabName === 'content-mgr') {
    populateContentForm();
    renderFaqAdminList();
  }
}

// -------------------------------------------------------------
// TAB 1: Dashboard
// -------------------------------------------------------------
function renderDashboard() {
  const orders = adminState.orders;

  // Calculate Metrics
  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  const revEl = document.getElementById('stat-revenue');
  const ordEl = document.getElementById('stat-orders');
  const penEl = document.getElementById('stat-pending');
  const proEl = document.getElementById('stat-products');
  const badgeEl = document.getElementById('pending-orders-badge');

  if (revEl) revEl.textContent = `৳${totalRevenue.toLocaleString()}`;
  if (ordEl) ordEl.textContent = `${orders.length}টি`;
  if (penEl) penEl.textContent = `${pendingCount}টি`;
  if (proEl) proEl.textContent = `${adminState.products.length}টি`;

  if (badgeEl) {
    if (pendingCount > 0) {
      badgeEl.textContent = pendingCount;
      badgeEl.classList.remove('hidden');
    } else {
      badgeEl.classList.add('hidden');
    }
  }

  // Recent 5 Orders Table
  const tbody = document.getElementById('recent-orders-tbody');
  if (!tbody) return;

  const recent = orders.slice(0, 5);

  if (recent.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-slate-400">
          এখনো কোনো অর্ডার আসেনি। ওয়েবসাইটে টেস্ট অর্ডার করে দেখতে পারেন।
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = recent.map(order => {
    const totalItems = order.items.reduce((s, it) => s + it.quantity, 0);
    return `
      <tr class="hover:bg-slate-50/60 transition-colors">
        <td class="p-3 font-bold text-slate-900">
          #${order.orderId}
          <div class="text-[10px] text-slate-400 font-normal">${order.orderDate}</div>
        </td>
        <td class="p-3">
          <div class="font-bold text-slate-800">${order.customer.name}</div>
          <div class="text-[11px] text-slate-500">${order.customer.phone}</div>
        </td>
        <td class="p-3 font-semibold text-slate-700">${totalItems}টি আইটেম</td>
        <td class="p-3">
          ${renderPaymentBadge(order.payment)}
        </td>
        <td class="p-3 font-bold text-slate-900">৳${order.grandTotal.toLocaleString()}</td>
        <td class="p-3">
          ${renderStatusBadge(order.status)}
        </td>
        <td class="p-3 text-right">
          <button onclick="viewAdminInvoice('${order.orderId}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
            ইনভয়েস
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// -------------------------------------------------------------
// TAB 2: Orders Management
// -------------------------------------------------------------
function filterOrdersByStatus(status) {
  adminState.orderStatusFilter = status;

  document.querySelectorAll('.order-filter-btn').forEach(btn => {
    btn.className = 'order-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200';
  });
  event.target.className = 'order-filter-btn active px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF758C] text-white';

  applyOrderFilters();
}

function handleOrderSearch(query) {
  adminState.orderSearchQuery = query.toLowerCase().trim();
  applyOrderFilters();
}

function applyOrderFilters() {
  let list = [...adminState.orders];

  if (adminState.orderStatusFilter !== 'all') {
    list = list.filter(o => o.status === adminState.orderStatusFilter);
  }

  if (adminState.orderSearchQuery) {
    const q = adminState.orderSearchQuery;
    list = list.filter(o => 
      o.orderId.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      (o.payment && o.payment.trxId && o.payment.trxId.toLowerCase().includes(q))
    );
  }

  adminState.filteredOrders = list;
  renderOrdersTable();
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-full-tbody');
  const emptyState = document.getElementById('orders-empty-state');
  if (!tbody) return;

  const orders = adminState.filteredOrders;

  if (orders.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  tbody.innerHTML = orders.map(order => {
    return `
      <tr class="hover:bg-slate-50/70 transition-colors">
        
        <!-- Order info -->
        <td class="p-3.5 align-top">
          <div class="font-black text-slate-900 text-xs">#${order.orderId}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${order.orderDate}</div>
          <div class="text-[10px] text-slate-400">${order.orderTime || ''}</div>
          <div class="mt-1">
            <span class="px-2 py-0.5 rounded text-[9px] font-bold ${order.customer.deliveryZone === 'inside' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}">
              ${order.customer.deliveryZone === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}
            </span>
          </div>
        </td>

        <!-- Customer info -->
        <td class="p-3.5 align-top">
          <div class="font-bold text-slate-800 text-xs">${order.customer.name}</div>
          <div class="text-[11px] text-[#FF758C] font-semibold mt-0.5">📞 ${order.customer.phone}</div>
          <div class="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">${order.customer.address}</div>
          ${order.customer.notes ? `<div class="text-[10px] text-amber-700 bg-amber-50 p-1 rounded mt-1">নোট: ${order.customer.notes}</div>` : ''}
        </td>

        <!-- Items list -->
        <td class="p-3.5 align-top">
          <div class="space-y-1.5 max-w-xs">
            ${order.items.map(item => `
              <div class="flex items-center gap-2 text-[11px] text-slate-700">
                <img src="${item.image}" class="w-7 h-7 rounded-md object-cover border" />
                <div class="truncate">
                  <span class="font-semibold">${item.nameBn}</span>
                  <span class="text-slate-400 text-[10px]">(${item.size}) × ${item.quantity}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </td>

        <!-- Payment Info & TrxID -->
        <td class="p-3.5 align-top">
          ${renderPaymentDetails(order.payment)}
        </td>

        <!-- Total Amount -->
        <td class="p-3.5 align-top">
          <div class="text-sm font-black text-slate-900">৳${order.grandTotal.toLocaleString()}</div>
          <div class="text-[10px] text-slate-400">ডেলিভারি: ${order.delivery === 0 ? 'ফ্রি' : `৳${order.delivery}`}</div>
        </td>

        <!-- Status Change Dropdown -->
        <td class="p-3.5 align-top">
          <select 
            onchange="updateOrderStatus('${order.orderId}', this.value)"
            class="px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-[#FF758C] ${getStatusSelectClass(order.status)}">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>⚙️ Processing</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>🚚 Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>✅ Delivered</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
          </select>
        </td>

        <!-- Actions -->
        <td class="p-3.5 align-top text-right space-y-1">
          <button 
            onclick="viewAdminInvoice('${order.orderId}')" 
            title="ইনভয়েস দেখুন ও প্রিন্ট করুন"
            class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold inline-block">
            🧾 রসিদ
          </button>
          <br>
          <button 
            onclick="chatCustomerWhatsApp('${order.orderId}')" 
            title="কাস্টমারকে সরাসরি হোয়াটসঅ্যাপ করুন"
            class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
            <span>💬 WhatsApp</span>
          </button>
          <br>
          <button 
            onclick="deleteOrder('${order.orderId}')" 
            title="অর্ডার ডিলিট করুন"
            class="text-[10px] text-rose-500 hover:text-rose-700 hover:underline">
            ডিলিট
          </button>
        </td>

      </tr>
    `;
  }).join('');
}

function renderPaymentBadge(payment) {
  if (!payment || payment.method === 'Cash on Delivery') {
    return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">💵 COD</span>`;
  }
  if (payment.method === 'bKash') {
    return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-[#E2136E]">📱 bKash</span>`;
  }
  if (payment.method === 'Nagad') {
    return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#F7941D]">🟠 Nagad</span>`;
  }
  return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">${payment.method}</span>`;
}

function renderPaymentDetails(payment) {
  if (!payment || payment.method === 'Cash on Delivery') {
    return `
      <div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">💵 ক্যাশ অন ডেলিভারি</span>
        <div class="text-[10px] text-slate-400 mt-1">পণ্য পেয়ে মূল্য পরিশোধ করবে</div>
      </div>
    `;
  }

  const isBkash = payment.method === 'bKash';
  const colorClass = isBkash ? 'border-pink-200 bg-pink-50/60 text-pink-900' : 'border-orange-200 bg-orange-50/60 text-orange-900';

  return `
    <div class="p-2 rounded-xl border ${colorClass} text-xs space-y-1">
      <div class="font-bold flex items-center justify-between">
        <span>${isBkash ? '📱 bKash' : '🟠 Nagad'}</span>
        <span class="text-[9px] bg-white px-1.5 py-0.5 rounded border">ভেরিফাই করুন</span>
      </div>
      <div><strong>নম্বর:</strong> ${payment.senderNumber || 'দেওয়া হয়নি'}</div>
      <div class="font-mono text-[11px] bg-white p-1 rounded border">
        <strong>TrxID:</strong> <span class="font-black text-slate-900">${payment.trxId || 'N/A'}</span>
      </div>
    </div>
  `;
}

function renderStatusBadge(status) {
  const map = {
    'Pending': 'bg-amber-100 text-amber-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-emerald-100 text-emerald-800',
    'Cancelled': 'bg-rose-100 text-rose-800'
  };
  return `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${map[status] || 'bg-slate-100 text-slate-700'}">${status}</span>`;
}

function getStatusSelectClass(status) {
  const map = {
    'Pending': 'bg-amber-50 text-amber-800 border-amber-200',
    'Processing': 'bg-blue-50 text-blue-800 border-blue-200',
    'Shipped': 'bg-purple-50 text-purple-800 border-purple-200',
    'Delivered': 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Cancelled': 'bg-rose-50 text-rose-800 border-rose-200'
  };
  return map[status] || 'bg-slate-50 text-slate-800 border-slate-200';
}

function updateOrderStatus(orderId, newStatus) {
  const order = adminState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  order.status = newStatus;
  saveStoredOrders(adminState.orders);
  renderDashboard();
  renderOrdersTable();
  showToast(`✅ #${orderId} অর্ডারের স্ট্যাটাস "${newStatus}" করা হয়েছে`);
}

function deleteOrder(orderId) {
  if (!confirm(`আপনি কি নিশ্চিত যে #${orderId} অর্ডারটি মুছে ফেলতে চান?`)) return;

  adminState.orders = adminState.orders.filter(o => o.orderId !== orderId);
  adminState.filteredOrders = adminState.filteredOrders.filter(o => o.orderId !== orderId);
  saveStoredOrders(adminState.orders);
  renderDashboard();
  renderOrdersTable();
  showToast(`🗑️ #${orderId} অর্ডারটি সফলভাবে ডিলিট করা হয়েছে`);
}

function chatCustomerWhatsApp(orderId) {
  const order = adminState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  let phone = order.customer.phone.replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '88' + phone;
  }

  const msg = `হ্যালো ${order.customer.name}! Eluno থেকে যোগাযোগ করা হচ্ছে আপনার অর্ডার #${order.orderId} সম্পর্কে।`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// -------------------------------------------------------------
// TAB 3: Products Management
// -------------------------------------------------------------
function handleAdminProductSearch(query) {
  adminState.productSearchQuery = query.toLowerCase().trim();
  let list = [...adminState.products];

  if (adminState.productSearchQuery) {
    const q = adminState.productSearchQuery;
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.nameBn && p.nameBn.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  adminState.filteredProducts = list;
  renderProductsTable();
}

function renderProductsTable() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  tbody.innerHTML = adminState.filteredProducts.map(p => {
    return `
      <tr class="hover:bg-slate-50/70 transition-colors">
        <td class="p-3.5">
          <img src="${p.image}" class="w-12 h-12 rounded-xl object-cover border border-slate-200" />
        </td>
        <td class="p-3.5">
          <div class="font-bold text-slate-800 text-xs">${p.nameBn || p.name}</div>
          <div class="text-[10px] text-slate-400">${p.name}</div>
          <div class="flex gap-1 mt-1">
            ${p.isBestSeller ? '<span class="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] rounded font-bold">Best Seller</span>' : ''}
            ${p.isNew ? '<span class="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[9px] rounded font-bold">New</span>' : ''}
          </div>
        </td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-[#FF758C] border border-rose-100">
            ${p.categoryName || p.category}
          </span>
        </td>
        <td class="p-3.5">
          <div class="font-black text-slate-900 text-xs">৳${p.price.toLocaleString()}</div>
          ${p.originalPrice ? `<div class="text-[10px] text-slate-400 line-through">৳${p.originalPrice.toLocaleString()}</div>` : ''}
        </td>
        <td class="p-3.5">
          <div class="text-[11px] text-slate-600 max-w-xs">
            ${p.sizes ? p.sizes.join(', ') : 'Standard'}
          </div>
        </td>
        <td class="p-3.5">
          <button 
            onclick="toggleProductStock(${p.id})"
            class="px-2.5 py-1 rounded-full text-[10px] font-bold ${p.inStock ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'}">
            ${p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
          </button>
        </td>
        <td class="p-3.5 text-right space-x-1">
          <button 
            onclick="openProductModal(${p.id})" 
            class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
            ✏️ এডিট
          </button>
          <button 
            onclick="deleteProduct(${p.id})" 
            class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold">
            🗑️ মুছুন
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleProductStock(productId) {
  const product = adminState.products.find(p => p.id === productId);
  if (!product) return;

  product.inStock = !product.inStock;
  saveStoredProducts(adminState.products);
  renderProductsTable();
  showToast(`পণ্যটির স্টক স্ট্যাটাস পরিবর্তন করা হয়েছে`);
}

function deleteProduct(productId) {
  const product = adminState.products.find(p => p.id === productId);
  if (!confirm(`আপনি কি "${product.nameBn || product.name}" পণ্যটি মুছে ফেলতে চান?`)) return;

  adminState.products = adminState.products.filter(p => p.id !== productId);
  adminState.filteredProducts = adminState.filteredProducts.filter(p => p.id !== productId);
  saveStoredProducts(adminState.products);
  renderProductsTable();
  renderDashboard();
  showToast('🗑️ পণ্যটি সফলভাবে মুছে ফেলা হয়েছে');
}

// Product Add / Edit Modal
function openProductModal(productId = null) {
  adminState.editingProductId = productId;
  const modal = document.getElementById('product-modal');
  const title = document.getElementById('product-modal-title');
  const form = document.getElementById('product-form');

  form.reset();
  const prevBox = document.getElementById('image-preview-box');
  if (prevBox) prevBox.classList.add('hidden');

  if (productId) {
    title.textContent = 'পণ্যের তথ্য এডিট করুন';
    const product = adminState.products.find(p => p.id === productId);
    if (product) {
      document.getElementById('prod_id').value = product.id;
      document.getElementById('prod_nameBn').value = product.nameBn || '';
      document.getElementById('prod_name').value = product.name || '';
      document.getElementById('prod_category').value = product.category || 'newborn';
      document.getElementById('prod_price').value = product.price || '';
      document.getElementById('prod_originalPrice').value = product.originalPrice || '';
      document.getElementById('prod_sizes').value = product.sizes ? product.sizes.join(', ') : '';
      document.getElementById('prod_colors').value = product.colors ? product.colors.join(', ') : '';
      document.getElementById('prod_image').value = product.image || '';
      document.getElementById('prod_description').value = product.description || '';
      document.getElementById('prod_inStock').checked = product.inStock !== false;
      document.getElementById('prod_isBestSeller').checked = !!product.isBestSeller;
      document.getElementById('prod_isNew').checked = !!product.isNew;
      previewProductImage(product.image);
    }
  } else {
    title.textContent = 'নতুন প্রোডাক্ট যুক্ত করুন';
    document.getElementById('prod_id').value = '';
    document.getElementById('prod_inStock').checked = true;
  }

  if (modal) modal.classList.add('active');
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('active');
}

function previewProductImage(url) {
  const box = document.getElementById('image-preview-box');
  const img = document.getElementById('image-preview-img');
  if (url && url.startsWith('http') && box && img) {
    img.src = url;
    box.classList.remove('hidden');
  } else if (box) {
    box.classList.add('hidden');
  }
}

function handleSaveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('prod_id').value;
  const nameBn = document.getElementById('prod_nameBn').value.trim();
  const name = document.getElementById('prod_name').value.trim() || nameBn;
  const category = document.getElementById('prod_category').value;
  const price = parseInt(document.getElementById('prod_price').value, 10);
  const originalPrice = parseInt(document.getElementById('prod_originalPrice').value, 10) || null;
  const sizesRaw = document.getElementById('prod_sizes').value.trim();
  const colorsRaw = document.getElementById('prod_colors').value.trim();
  const image = document.getElementById('prod_image').value.trim();
  const description = document.getElementById('prod_description').value.trim();
  const inStock = document.getElementById('prod_inStock').checked;
  const isBestSeller = document.getElementById('prod_isBestSeller').checked;
  const isNew = document.getElementById('prod_isNew').checked;

  const sizes = sizesRaw ? sizesRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Standard'];
  const colors = colorsRaw ? colorsRaw.split(',').map(c => c.trim()).filter(Boolean) : [];

  const catMap = {
    'newborn': 'Newborn Essentials',
    'toddler': 'Toddler & Kids',
    'toys': 'Toys & Keepsakes',
    'nursery': 'Nursery & Bedding',
    'giftbox': 'Gift Sets'
  };

  let discount = '';
  if (originalPrice && originalPrice > price) {
    const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
    discount = `${pct}% OFF`;
  }

  if (id) {
    // Edit existing product
    const idx = adminState.products.findIndex(p => p.id === parseInt(id, 10));
    if (idx > -1) {
      adminState.products[idx] = {
        ...adminState.products[idx],
        name,
        nameBn,
        category,
        categoryName: catMap[category] || category,
        price,
        originalPrice,
        discount,
        sizes,
        colors,
        image,
        description,
        inStock,
        isBestSeller,
        isNew
      };
      showToast('✅ প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে');
    }
  } else {
    // Create new product
    const newId = Date.now();
    const newProduct = {
      id: newId,
      name,
      nameBn,
      category,
      categoryName: catMap[category] || category,
      price,
      originalPrice,
      discount,
      rating: 5.0,
      reviewsCount: 1,
      isBestSeller,
      isNew,
      image,
      images: [image],
      sizes,
      colors,
      description,
      inStock
    };
    adminState.products.unshift(newProduct);
    showToast('🎉 নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে!');
  }

  saveStoredProducts(adminState.products);
  adminState.filteredProducts = [...adminState.products];
  renderProductsTable();
  renderDashboard();
  closeProductModal();
}

// -------------------------------------------------------------
// TAB 4: Store Settings
// -------------------------------------------------------------
function populateSettingsForm() {
  const s = adminState.settings;
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setEl('set_announcement', s.announcement);
  setEl('set_bkash', s.bkashNumber);
  setEl('set_nagad', s.nagadNumber);
  setEl('set_delivery_inside', s.deliveryInside);
  setEl('set_delivery_outside', s.deliveryOutside);
  setEl('set_free_threshold', s.freeDeliveryThreshold);
  setEl('set_hotline', s.hotline);
  setEl('set_whatsapp', s.whatsapp);
  setEl('set_facebook', s.facebookUrl);
  setEl('set_email', s.email);
  setEl('set_address', s.address);
  setEl('set_admin_pin', s.adminPin || '1234');

  // Populate Specific Element Typography
  setEl('set_heading_font', s.headingFont || 'Quicksand');
  setEl('set_heading_size', s.headingSize || '100%');
  setEl('set_prod_title_font', s.productTitleFont || 'Hind Siliguri');
  setEl('set_prod_title_size', s.productTitleSize || '0.875rem');
  setEl('set_price_size', s.priceSize || '1.15rem');
  setEl('set_body_font', s.bodyFont || 'Hind Siliguri');
  setEl('set_body_size', s.bodySize || '0.85rem');

  updateSpecificTypographyPreview();
}

function updateSpecificTypographyPreview() {
  const getVal = id => document.getElementById(id)?.value;

  const headingFont = getVal('set_heading_font') || 'Quicksand';
  const headingSize = getVal('set_heading_size') || '100%';
  const prodTitleFont = getVal('set_prod_title_font') || 'Hind Siliguri';
  const prodTitleSize = getVal('set_prod_title_size') || '0.875rem';
  const priceSize = getVal('set_price_size') || '1.15rem';
  const bodyFont = getVal('set_body_font') || 'Hind Siliguri';
  const bodySize = getVal('set_body_size') || '0.85rem';

  // Preview elements
  const prevHeading = document.getElementById('prev-heading-el');
  const prevProdTitle = document.getElementById('prev-prod-title-el');
  const prevPrice = document.getElementById('prev-price-el');
  const prevBody = document.getElementById('prev-body-el');

  if (prevHeading) {
    prevHeading.style.fontFamily = `'${headingFont}', sans-serif`;
    prevHeading.style.fontSize = `calc(1.125rem * (${headingSize} / 100))`;
  }
  if (prevProdTitle) {
    prevProdTitle.style.fontFamily = `'${prodTitleFont}', sans-serif`;
    prevProdTitle.style.fontSize = prodTitleSize;
  }
  if (prevPrice) {
    prevPrice.style.fontSize = priceSize;
  }
  if (prevBody) {
    prevBody.style.fontFamily = `'${bodyFont}', sans-serif`;
    prevBody.style.fontSize = bodySize;
  }

  // Dynamically update document variables
  document.documentElement.style.setProperty('--font-heading', `'${headingFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-heading', headingSize);
  document.documentElement.style.setProperty('--font-product-title', `'${prodTitleFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-product-title', prodTitleSize);
  document.documentElement.style.setProperty('--size-price', priceSize);
  document.documentElement.style.setProperty('--font-body', `'${bodyFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-body', bodySize);
}

function handleSaveSettings(e) {
  e.preventDefault();

  const getVal = id => document.getElementById(id)?.value.trim();

  const headingFont = getVal('set_heading_font') || 'Quicksand';
  const headingSize = getVal('set_heading_size') || '100%';
  const prodTitleFont = getVal('set_prod_title_font') || 'Hind Siliguri';
  const prodTitleSize = getVal('set_prod_title_size') || '0.875rem';
  const priceSize = getVal('set_price_size') || '1.15rem';
  const bodyFont = getVal('set_body_font') || 'Hind Siliguri';
  const bodySize = getVal('set_body_size') || '0.85rem';

  const updated = {
    ...adminState.settings,
    announcement: getVal('set_announcement'),
    bkashNumber: getVal('set_bkash'),
    nagadNumber: getVal('set_nagad'),
    deliveryInside: parseInt(getVal('set_delivery_inside'), 10) || 60,
    deliveryOutside: parseInt(getVal('set_delivery_outside'), 10) || 120,
    freeDeliveryThreshold: parseInt(getVal('set_free_threshold'), 10) || 2500,
    hotline: getVal('set_hotline'),
    whatsapp: getVal('set_whatsapp'),
    facebookUrl: getVal('set_facebook'),
    email: getVal('set_email'),
    address: getVal('set_address'),
    adminPin: getVal('set_admin_pin') || '1234',

    // Specific Typography Controls
    headingFont: headingFont,
    headingSize: headingSize,
    productTitleFont: prodTitleFont,
    productTitleSize: prodTitleSize,
    priceSize: priceSize,
    bodyFont: bodyFont,
    bodySize: bodySize
  };

  adminState.settings = updated;
  saveStoredSettings(updated);
  updateSpecificTypographyPreview();
  showToast('💾 দোকান ও স্পেসিফিক ফন্ট সেটিংস সফলভাবে সেভ করা হয়েছে!');
}

// -------------------------------------------------------------
// TAB: Website Content & Texts Manager
// -------------------------------------------------------------
function populateContentForm() {
  const s = adminState.settings;
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  };

  setEl('cnt_hero_badge', s.heroBadge || '✨ Little Moments, Big Love');
  setEl('cnt_hero_title', s.heroTitle || 'শিশুর প্রথম হাসি আর প্রতিটি মিষ্টি মুহূর্তের পরম যত্ন।');
  setEl('cnt_hero_subtitle', s.heroSubtitle || '১০০% সার্টিফাইড অর্গানিক কটন বেবি পোশাক, প্রাকৃতিক কাঠের মন্টেসরি খেলনা ও প্রিমিয়াম গিফট হ্যাম্পার—যা আপনার ছোট্ট সোনামণিকে দেবে অতুলনীয় আরাম ও নিরাপদ ভালোবাসা।');
  setEl('cnt_hero_image', s.heroImage || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80');
  setEl('cnt_hero_btn1', s.heroBtn1 || 'কালেকশন দেখুন');
  setEl('cnt_hero_btn2', s.heroBtn2 || '🎁 বেবি গিফট বক্স');

  setEl('cnt_catalog_badge', s.catalogBadge || '🌸 আমাদের স্পেশাল কালেকশন');
  setEl('cnt_catalog_title', s.catalogTitle || 'আপনার সোনামণির জন্য সেরা পণ্যটি বেছে নিন');
  setEl('cnt_catalog_subtitle', s.catalogSubtitle || 'নবজাতক থেকে ৫ বছর বয়সী বাচ্চাদের জন্য প্রিমিয়াম ড্রেস, মন্টেসরি খেলনা ও উপহার সামগ্রী');

  setEl('cnt_footer_about', s.footerAbout || 'শিশুর সংবেদনশীল ত্বকের জন্য পরম যত্ন ও প্রিমিয়াম ভালোবাসার স্পর্শ। প্রতিটি মিষ্টি মুহূর্ত আনন্দময় হোক।');
}

function renderFaqAdminList() {
  const container = document.getElementById('faq-admin-list');
  if (!container) return;

  if (!adminState.faqs || adminState.faqs.length === 0) {
    container.innerHTML = `
      <div class="p-4 bg-white rounded-xl text-center text-slate-400 text-xs">
        কোনো প্রশ্ন-উত্তর নেই। নতুন প্রশ্ন যুক্ত করতে উপরের বাটনে ক্লিক করুন।
      </div>
    `;
    return;
  }

  container.innerHTML = adminState.faqs.map((faq, index) => `
    <div class="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-2 relative group shadow-2xs">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold text-slate-700">প্রশ্ন #${index + 1}</span>
        <button type="button" onclick="deleteFaqRow(${index})" class="text-rose-500 hover:text-rose-700 text-xs font-bold p-1">
          মুছুন ✕
        </button>
      </div>
      <div>
        <input 
          type="text" 
          value="${(faq.q || '').replace(/"/g, '&quot;')}" 
          oninput="adminState.faqs[${index}].q = this.value"
          placeholder="প্রশ্ন লিখুন..." 
          class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-[#FF758C] focus:bg-white"
        />
      </div>
      <div>
        <textarea 
          rows="2" 
          oninput="adminState.faqs[${index}].a = this.value"
          placeholder="উত্তর লিখুন..." 
          class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#FF758C] focus:bg-white"
        >${faq.a || ''}</textarea>
      </div>
    </div>
  `).join('');
}

function addNewFaqRow() {
  if (!adminState.faqs) adminState.faqs = [];
  adminState.faqs.push({ q: 'নতুন প্রশ্ন এখানে লিখুন', a: 'এই প্রশ্নের বিস্তারিত উত্তর এখানে লিখুন...' });
  renderFaqAdminList();
}

function deleteFaqRow(index) {
  if (confirm('আপনি কি এই FAQ প্রশ্নটি মুছে ফেলতে চান?')) {
    adminState.faqs.splice(index, 1);
    renderFaqAdminList();
  }
}

function handleSaveContent(e) {
  e.preventDefault();

  const getVal = id => document.getElementById(id)?.value.trim();

  const updated = {
    ...adminState.settings,
    heroBadge: getVal('cnt_hero_badge'),
    heroTitle: getVal('cnt_hero_title'),
    heroSubtitle: getVal('cnt_hero_subtitle'),
    heroImage: getVal('cnt_hero_image'),
    heroBtn1: getVal('cnt_hero_btn1'),
    heroBtn2: getVal('cnt_hero_btn2'),

    catalogBadge: getVal('cnt_catalog_badge'),
    catalogTitle: getVal('cnt_catalog_title'),
    catalogSubtitle: getVal('cnt_catalog_subtitle'),

    footerAbout: getVal('cnt_footer_about'),
    faqs: adminState.faqs || []
  };

  adminState.settings = updated;
  saveStoredSettings(updated);
  showToast('💾 সমস্ত লেখা, ব্যানার ও FAQ সফলভাবে সেভ করা হয়েছে!');
}

// -------------------------------------------------------------
// TAB 5: Backup & Sync
// -------------------------------------------------------------
function exportAllData() {
  const payload = {
    storeName: 'Eluno',
    exportDate: new Date().toISOString(),
    products: adminState.products,
    orders: adminState.orders,
    settings: adminState.settings
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute('href', dataStr);
  dlAnchorElem.setAttribute('download', `eluno_backup_${new Date().toISOString().slice(0, 10)}.json`);
  dlAnchorElem.click();
  showToast('📥 ব্যাকআপ ফাইল ডাউনলোড সম্পন্ন হয়েছে');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.products && Array.isArray(data.products)) {
        saveStoredProducts(data.products);
        adminState.products = data.products;
      }
      if (data.orders && Array.isArray(data.orders)) {
        saveStoredOrders(data.orders);
        adminState.orders = data.orders;
      }
      if (data.settings && typeof data.settings === 'object') {
        saveStoredSettings(data.settings);
        adminState.settings = data.settings;
      }
      renderAllViews();
      showToast('✅ ব্যাকআপ থেকে ডাটা সফলভাবে রিস্টোর হয়েছে!');
    } catch (err) {
      alert('ভুল ফরম্যাট! সঠিক JSON ফাইল আপলোড করুন।');
    }
  };
  reader.readAsText(file);
}

function resetToDefaultData() {
  if (!confirm('আপনি কি সত্যিই সমস্ত ডাটা রিসেট করে ডিফল্ট ডেমো প্রোডাক্ট ও সেটিংস ফিরিয়ে আনতে চান?')) return;

  localStorage.removeItem('eluno_products');
  localStorage.removeItem('eluno_settings');
  loadData();
  renderAllViews();
  showToast('🔄 সফলভাবে ডিফল্ট সেটিংসে রিসেট করা হয়েছে');
}

// -------------------------------------------------------------
// Invoice Modal (Admin View)
// -------------------------------------------------------------
function viewAdminInvoice(orderId) {
  const order = adminState.orders.find(o => o.orderId === orderId);
  if (!order) return;

  const modal = document.getElementById('admin-invoice-modal');
  const container = document.getElementById('admin-invoice-container');
  if (!modal || !container) return;

  container.innerHTML = `
    <div id="printable-receipt" class="bg-white p-2">
      <div class="text-center pb-4 border-b border-dashed border-slate-200">
        <h3 class="text-2xl font-black text-slate-800">El<span class="text-[#FF758C]">uno</span></h3>
        <p class="text-xs text-rose-500 italic">Made for Little Moments.</p>
        <p class="text-xs text-slate-600 mt-2">অর্ডার চালান নং: <strong class="text-slate-900">#${order.orderId}</strong></p>
        <p class="text-[11px] text-slate-400">তারিখ: ${order.orderDate}, ${order.orderTime || ''}</p>
      </div>

      <div class="py-3 border-b border-slate-100 text-xs space-y-1">
        <div><strong>গ্রাহকের নাম:</strong> ${order.customer.name}</div>
        <div><strong>মোবাইল:</strong> ${order.customer.phone}</div>
        <div><strong>ঠিকানা:</strong> ${order.customer.address} (${order.customer.deliveryZone === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})</div>
        <div><strong>পেমেন্ট পদ্ধতি:</strong> ${order.payment.method}</div>
        ${order.payment.senderNumber ? `<div><strong>প্রেরকের নম্বর:</strong> ${order.payment.senderNumber}</div>` : ''}
        ${order.payment.trxId ? `<div><strong>TrxID:</strong> <span class="font-mono font-bold">${order.payment.trxId}</span></div>` : ''}
        ${order.customer.notes ? `<div><strong>বিশেষ নির্দেশ:</strong> ${order.customer.notes}</div>` : ''}
      </div>

      <div class="py-3 border-b border-dashed border-slate-200 text-xs">
        <div class="font-bold text-slate-800 mb-2">আইটেম বিবরণ:</div>
        <div class="space-y-1.5">
          ${order.items.map(it => `
            <div class="flex justify-between items-center text-slate-700">
              <span>${it.nameBn} (${it.size}) × ${it.quantity}</span>
              <span class="font-bold">৳${(it.price * it.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="py-3 text-xs space-y-1">
        <div class="flex justify-between text-slate-500">
          <span>সাব-টোটাল:</span>
          <span>৳${order.subtotal.toLocaleString()}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="flex justify-between text-rose-600 font-bold">
            <span>ছাড়:</span>
            <span>-৳${order.discount.toLocaleString()}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-slate-500">
          <span>ডেলিভারি চার্জ:</span>
          <span>${order.delivery === 0 ? 'ফ্রি' : `৳${order.delivery}`}</span>
        </div>
        <div class="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
          <span>সর্বমোট প্রদেয়:</span>
          <span class="text-[#FF758C]">৳${order.grandTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeAdminInvoice() {
  const modal = document.getElementById('admin-invoice-modal');
  if (modal) modal.classList.remove('active');
}

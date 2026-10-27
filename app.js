// =========================================================
// ELUNO - Made for Little Moments
// Main Application Logic & Storefront Engine
// =========================================================

// State Management
let appState = {
  products: getStoredProducts(),
  filteredProducts: getStoredProducts(),
  settings: getStoredSettings(),
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  cart: JSON.parse(localStorage.getItem('eluno_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('eluno_wishlist') || '[]'),
  selectedProductForModal: null,
  appliedPromo: null,
  deliveryZone: 'inside', // 'inside' = 60, 'outside' = 120
  deliveryCost: 60,
  freeDeliveryThreshold: 2500
};

// Available Promo Codes
const PROMO_CODES = {
  'MOMENTS10': { discountPercent: 10, label: '১০% ছাড় (নতুন গ্রাহক)' },
  'ELUNO50': { discountAmount: 50, label: '৳৫০ ফ্ল্যাট ছাড়' },
  'LITTLE20': { discountPercent: 20, label: '২০% সুপার সেভার' }
};

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Sync state with settings
  syncStoreSettings();

  // Render components
  renderCategoryPills();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  setupEventListeners();
  togglePaymentBoxes();
});

// -------------------------------------------------------------
// Synchronize Store Settings with Page Elements
// -------------------------------------------------------------
function syncStoreSettings() {
  const s = appState.settings;

  // Announcement Bar
  const annEl = document.getElementById('announcement-text');
  if (annEl && s.announcement) {
    annEl.innerHTML = `🎉 ${s.announcement}`;
  }

  // Top Hotline
  const topHotline = document.getElementById('top-hotline');
  if (topHotline && s.hotline) {
    topHotline.textContent = `📞 হটলাইন: ${s.hotline}`;
  }

  // Footer Info
  const footerAddress = document.getElementById('footer-address');
  if (footerAddress && s.address) footerAddress.textContent = s.address;

  const footerHotline = document.getElementById('footer-hotline');
  if (footerHotline && s.hotline) footerHotline.textContent = `${s.hotline} (সকাল ৯টা - রাত ১০টা)`;

  const footerEmail = document.getElementById('footer-email');
  if (footerEmail && s.email) footerEmail.textContent = s.email;

  // Social Links
  const navFb = document.getElementById('nav-facebook-link');
  if (navFb && s.facebookUrl) navFb.href = s.facebookUrl;

  const footerFb = document.getElementById('footer-facebook-link');
  if (footerFb && s.facebookUrl) footerFb.href = s.facebookUrl;

  const footerInsta = document.getElementById('footer-instagram-link');
  if (footerInsta && s.instagramUrl) footerInsta.href = s.instagramUrl;

  // WhatsApp Button
  const waBtn = document.getElementById('floating-whatsapp-btn');
  if (waBtn && s.whatsapp) {
    const cleanWa = s.whatsapp.replace(/[^0-9]/g, '');
    waBtn.href = `https://wa.me/${cleanWa}?text=Hello%20Eluno!%20I%20would%20like%20to%20order%20baby%20products.`;
  }

  // Dynamic Website Texts & Banner Content
  const heroBadge = document.getElementById('hero-badge-text');
  if (heroBadge && s.heroBadge) heroBadge.textContent = s.heroBadge;

  const heroTitle = document.getElementById('hero-title-text');
  if (heroTitle && s.heroTitle) heroTitle.innerHTML = s.heroTitle;

  const heroSub = document.getElementById('hero-subtitle-text');
  if (heroSub && s.heroSubtitle) heroSub.textContent = s.heroSubtitle;

  const heroImg = document.getElementById('hero-image-img');
  if (heroImg && s.heroImage) heroImg.src = s.heroImage;

  const heroBtn1 = document.getElementById('hero-btn1-text');
  if (heroBtn1 && s.heroBtn1) heroBtn1.textContent = s.heroBtn1;

  const heroBtn2 = document.getElementById('hero-btn2-text');
  if (heroBtn2 && s.heroBtn2) heroBtn2.textContent = s.heroBtn2;

  const catBadge = document.getElementById('catalog-badge-text');
  if (catBadge && s.catalogBadge) catBadge.textContent = s.catalogBadge;

  const catTitle = document.getElementById('catalog-title-text');
  if (catTitle && s.catalogTitle) catTitle.textContent = s.catalogTitle;

  const catSub = document.getElementById('catalog-subtitle-text');
  if (catSub && s.catalogSubtitle) catSub.textContent = s.catalogSubtitle;

  const footerAbout = document.getElementById('footer-about-text');
  if (footerAbout && s.footerAbout) footerAbout.textContent = s.footerAbout;

  // Render Dynamic FAQs
  const faqList = document.getElementById('faq-dynamic-list');
  if (faqList && s.faqs && Array.isArray(s.faqs) && s.faqs.length > 0) {
    faqList.innerHTML = s.faqs.map(faq => `
      <details class="bg-rose-50/40 p-4 rounded-2xl border border-rose-100 group">
        <summary class="font-bold text-xs sm:text-sm text-slate-800 cursor-pointer list-none flex justify-between items-center">
          <span>${faq.q}</span>
          <span class="text-[#FF758C] group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-xs text-slate-600 mt-2.5 pt-2 border-t border-rose-100 leading-relaxed">
          ${faq.a}
        </p>
      </details>
    `).join('');
  }

  // Payment Numbers in Checkout
  const bkashNumEl = document.getElementById('bkash-display-number');
  if (bkashNumEl && s.bkashNumber) bkashNumEl.textContent = s.bkashNumber;

  const nagadNumEl = document.getElementById('nagad-display-number');
  if (nagadNumEl && s.nagadNumber) nagadNumEl.textContent = s.nagadNumber;

  // Delivery Charges in Checkout
  const chargeIn = document.getElementById('checkout-charge-inside');
  if (chargeIn && s.deliveryInside) chargeIn.textContent = `চার্জ: ৳${s.deliveryInside} (১-২ দিন)`;

  const chargeOut = document.getElementById('checkout-charge-outside');
  if (chargeOut && s.deliveryOutside) chargeOut.textContent = `চার্জ: ৳${s.deliveryOutside} (২-৩ দিন)`;

  appState.deliveryCost = appState.deliveryZone === 'inside' ? (s.deliveryInside || 60) : (s.deliveryOutside || 120);
  appState.freeDeliveryThreshold = s.freeDeliveryThreshold || 2500;

  // Apply Custom Typography & Fonts (Global & Specific)
  const fontBn = s.fontFamilyBn || 'Hind Siliguri';
  const fontEn = s.fontFamilyEn || 'Quicksand';
  const sizeMap = { 'small': '92%', 'normal': '100%', 'medium': '108%', 'large': '116%' };
  const fontSize = sizeMap[s.fontSizeScale || 'normal'] || '100%';

  document.documentElement.style.setProperty('--font-main', `'${fontBn}', '${fontEn}', sans-serif`);
  document.documentElement.style.setProperty('--font-title', `'${fontEn}', '${fontBn}', sans-serif`);
  document.documentElement.style.setProperty('--base-font-size', fontSize);

  // Specific Element Font & Size Controls
  const headingFont = s.headingFont || fontEn;
  const headingSize = s.headingSize || '100%';
  const prodTitleFont = s.productTitleFont || fontBn;
  const prodTitleSize = s.productTitleSize || '0.875rem';
  const priceSize = s.priceSize || '1.15rem';
  const bodyFont = s.bodyFont || fontBn;
  const bodySize = s.bodySize || '0.85rem';

  document.documentElement.style.setProperty('--font-heading', `'${headingFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-heading', headingSize);
  document.documentElement.style.setProperty('--font-product-title', `'${prodTitleFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-product-title', prodTitleSize);
  document.documentElement.style.setProperty('--size-price', priceSize);
  document.documentElement.style.setProperty('--font-body', `'${bodyFont}', sans-serif`);
  document.documentElement.style.setProperty('--size-body', bodySize);
}

// Setup All Interactive Event Listeners
function setupEventListeners() {
  // Search Input
  const searchInput = document.getElementById('search-input');
  const searchInputMobile = document.getElementById('search-input-mobile');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }
  if (searchInputMobile) {
    searchInputMobile.addEventListener('input', (e) => handleSearch(e.target.value));
  }

  // Sort Dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      appState.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Delivery Zone Change
  document.querySelectorAll('input[name="delivery_zone"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      appState.deliveryZone = e.target.value;
      appState.deliveryCost = e.target.value === 'inside' 
        ? (appState.settings.deliveryInside || 60) 
        : (appState.settings.deliveryOutside || 120);
      updateCartSummary();
      updateCheckoutSummary();
    });
  });

  // Close modals on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeQuickView();
      closeCheckoutModal();
      closeOrderSuccessModal();
      closeWishlistModal();
    }
  });
}

// -------------------------------------------------------------
// Category Filtering
// -------------------------------------------------------------
function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;

  container.innerHTML = categoriesData.map(cat => {
    const isActive = appState.currentCategory === cat.id;
    return `
      <button 
        onclick="selectCategory('${cat.id}')"
        class="cat-pill whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 border border-rose-200 flex items-center gap-2 ${
          isActive 
            ? 'active' 
            : 'bg-white text-slate-700 hover:bg-rose-50 hover:border-rose-300'
        }">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `;
  }).join('');
}

function selectCategory(categoryId) {
  appState.currentCategory = categoryId;
  renderCategoryPills();
  applyFilters();

  const section = document.getElementById('products-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// -------------------------------------------------------------
// Search & Filter Pipeline
// -------------------------------------------------------------
function handleSearch(query) {
  appState.searchQuery = query.toLowerCase().trim();
  applyFilters();
}

function resetFilters() {
  appState.searchQuery = '';
  appState.currentCategory = 'all';
  const sInput = document.getElementById('search-input');
  const sInputM = document.getElementById('search-input-mobile');
  if (sInput) sInput.value = '';
  if (sInputM) sInputM.value = '';
  renderCategoryPills();
  applyFilters();
}

function applyFilters() {
  let list = [...appState.products];

  // Category filter
  if (appState.currentCategory !== 'all') {
    list = list.filter(item => item.category === appState.currentCategory);
  }

  // Search filter
  if (appState.searchQuery) {
    list = list.filter(item => 
      item.name.toLowerCase().includes(appState.searchQuery) ||
      (item.nameBn && item.nameBn.toLowerCase().includes(appState.searchQuery)) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(appState.searchQuery)) ||
      (item.description && item.description.toLowerCase().includes(appState.searchQuery))
    );
  }

  // Sort
  if (appState.sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (appState.sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (appState.sortBy === 'rating') {
    list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  appState.filteredProducts = list;
  renderProducts();
}

// -------------------------------------------------------------
// Render Products Grid
// -------------------------------------------------------------
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('product-count');
  const noFound = document.getElementById('no-products-found');
  if (!grid) return;

  if (countEl) {
    countEl.textContent = `${appState.filteredProducts.length}টি`;
  }

  if (appState.filteredProducts.length === 0) {
    grid.innerHTML = '';
    if (noFound) noFound.classList.remove('hidden');
    return;
  }

  if (noFound) noFound.classList.add('hidden');

  grid.innerHTML = appState.filteredProducts.map(product => {
    const isWishlisted = appState.wishlist.includes(product.id);
    return `
      <div class="product-card flex flex-col justify-between group relative shadow-xs">
        
        <!-- Image & Badges -->
        <div class="product-img-wrapper aspect-square relative w-full overflow-hidden">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy"
            class="w-full h-full object-cover cursor-pointer"
            onclick="openQuickView(${product.id})"
          />
          
          <!-- Badges -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            ${product.isBestSeller ? `
              <span class="px-2 py-0.5 bg-[#FF758C] text-white text-[10px] font-bold tracking-wider rounded-md uppercase shadow-xs">
                বেস্ট সেলার
              </span>
            ` : ''}
            ${product.isNew ? `
              <span class="px-2 py-0.5 bg-[#4ECCA3] text-white text-[10px] font-bold tracking-wider rounded-md uppercase shadow-xs">
                নতুন
              </span>
            ` : ''}
            ${product.discount ? `
              <span class="px-2 py-0.5 bg-[#FFA07A] text-white text-[10px] font-bold rounded-md shadow-xs">
                ${product.discount}
              </span>
            ` : ''}
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            onclick="toggleWishlist(${product.id})" 
            title="পছন্দের তালিকায় রাখুন"
            class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all duration-200 z-10 ${isWishlisted ? 'text-rose-500' : 'hover:text-rose-500'}">
            <svg class="w-4 h-4 ${isWishlisted ? 'fill-[#FF758C] text-[#FF758C]' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>

          <!-- Quick Action Hover Bar -->
          <div class="product-actions-overlay absolute bottom-3 inset-x-3 hidden md:flex gap-2 z-10">
            <button 
              onclick="openQuickView(${product.id})"
              class="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-slate-800 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors">
              <span>👀 কুইক ভিউ</span>
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white rounded-b-3xl">
          <div>
            <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span class="text-rose-500 font-semibold tracking-wide">${product.categoryName || 'বেবি কালেকশন'}</span>
              <div class="flex items-center text-amber-400 font-bold gap-0.5">
                <span>★</span>
                <span class="text-slate-700">${product.rating || '4.9'}</span>
              </div>
            </div>

            <h4 
              onclick="openQuickView(${product.id})"
              class="product-title-el font-bold text-slate-800 line-clamp-2 hover:text-[#FF758C] cursor-pointer transition-colors leading-snug mb-2">
              ${product.nameBn || product.name}
            </h4>

            <div class="flex items-baseline gap-2 mb-3">
              <span class="product-price-el font-black text-[#FF758C]">৳${product.price.toLocaleString()}</span>
              ${product.originalPrice ? `
                <span class="text-xs text-slate-400 line-through">৳${product.originalPrice.toLocaleString()}</span>
              ` : ''}
            </div>
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-rose-50">
            <button 
              onclick="directOrderNow(${product.id})"
              class="py-2 px-2 bg-gradient-to-r from-[#FF758C] to-[#FFA07A] hover:opacity-95 text-white font-bold text-[11px] sm:text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1">
              <span>অর্ডার করুন</span>
            </button>
            <button 
              onclick="addToCartWithDefaultSize(${product.id})"
              class="py-2 px-2 bg-rose-50 hover:bg-rose-100 text-[#E2556F] font-bold text-[11px] sm:text-xs rounded-xl transition-colors flex items-center justify-center gap-1">
              <span>+ কার্ট</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Quick View Modal
// -------------------------------------------------------------
function openQuickView(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  appState.selectedProductForModal = {
    ...product,
    selectedSize: product.sizes && product.sizes.length ? product.sizes[0] : 'Standard',
    selectedColor: product.colors && product.colors.length ? product.colors[0] : 'Default',
    quantity: 1
  };

  const modal = document.getElementById('quick-view-modal');
  const content = document.getElementById('quick-view-content');
  if (!modal || !content) return;

  const current = appState.selectedProductForModal;

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      
      <!-- Left: Image Gallery -->
      <div>
        <div class="rounded-2xl overflow-hidden aspect-square bg-rose-50 border border-rose-100 mb-3 shadow-inner">
          <img 
            id="modal-main-img" 
            src="${current.image}" 
            alt="${current.name}" 
            class="w-full h-full object-cover"
          />
        </div>
        ${current.images && current.images.length > 1 ? `
          <div class="flex gap-2 overflow-x-auto pb-1">
            ${current.images.map((img, idx) => `
              <img 
                src="${img}" 
                onclick="document.getElementById('modal-main-img').src='${img}'"
                class="w-16 h-16 rounded-xl object-cover border-2 border-rose-200 cursor-pointer hover:opacity-80 transition-opacity"
              />
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Right: Product Details -->
      <div class="flex flex-col justify-between space-y-4">
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-[#FF758C] mb-2 uppercase">
            ${current.categoryName || 'বেবি আইটেম'}
          </span>
          <h3 class="product-title-el text-xl font-bold text-slate-800 leading-snug">
            ${current.nameBn || current.name}
          </h3>
          <p class="text-xs text-slate-400 mt-1">${current.name}</p>

          <!-- Price -->
          <div class="flex items-baseline gap-3 my-3">
            <span class="product-price-el text-2xl font-black text-[#FF758C]">৳${current.price.toLocaleString()}</span>
            ${current.originalPrice ? `
              <span class="text-sm text-slate-400 line-through">৳${current.originalPrice.toLocaleString()}</span>
              <span class="px-2 py-0.5 bg-rose-100 text-[#FF758C] font-bold text-xs rounded-md">${current.discount || 'ছাড়'}</span>
            ` : ''}
          </div>

          <!-- Description -->
          <p class="product-desc-el text-xs text-slate-600 leading-relaxed mb-4">
            ${current.description || '১০০% নিরাপদ ও কোমল কাপড় দিয়ে তৈরি, যা শিশুর পরম আরাম নিশ্চিত করে।'}
          </p>

          <!-- Size Selector -->
          ${current.sizes && current.sizes.length ? `
            <div class="mb-3">
              <label class="block text-xs font-bold text-slate-700 mb-1.5">সাইজ বেছে নিন:</label>
              <div class="flex flex-wrap gap-2">
                ${current.sizes.map(size => `
                  <button 
                    onclick="selectModalSize('${size}', this)"
                    class="modal-size-pill px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      size === current.selectedSize 
                        ? 'bg-[#FF758C] text-white border-[#FF758C]' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                    }">
                    ${size}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Color Selector -->
          ${current.colors && current.colors.length ? `
            <div class="mb-3">
              <label class="block text-xs font-bold text-slate-700 mb-1.5">কালার/ডিজাইন:</label>
              <div class="flex flex-wrap gap-2">
                ${current.colors.map(col => `
                  <button 
                    onclick="selectModalColor('${col}', this)"
                    class="modal-color-pill px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                      col === current.selectedColor 
                        ? 'bg-slate-800 text-white border-slate-800' 
                        : 'bg-rose-50 text-slate-700 border-rose-100 hover:border-rose-300'
                    }">
                    ${col}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Quantity -->
          <div class="flex items-center gap-3 my-4">
            <span class="text-xs font-bold text-slate-700">পরিমাণ:</span>
            <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button onclick="changeModalQty(-1)" class="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold">-</button>
              <span id="modal-qty-val" class="px-4 py-1 text-xs font-bold text-slate-800">1</span>
              <button onclick="changeModalQty(1)" class="px-3 py-1 text-slate-600 hover:bg-slate-100 font-bold">+</button>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <button 
            onclick="addModalProductToCart()"
            class="py-3 bg-rose-50 hover:bg-rose-100 text-[#FF758C] font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2">
            <span>🛒 কার্টে রাখুন</span>
          </button>
          <button 
            onclick="orderModalProductDirectly()"
            class="py-3 bg-gradient-to-r from-[#FF758C] to-[#FFA07A] hover:opacity-95 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
            <span>⚡ এখনই অর্ডার করুন</span>
          </button>
        </div>

      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.remove('active');
}

function selectModalSize(size, el) {
  if (!appState.selectedProductForModal) return;
  appState.selectedProductForModal.selectedSize = size;
  document.querySelectorAll('.modal-size-pill').forEach(btn => {
    btn.className = 'modal-size-pill px-3 py-1.5 rounded-xl border text-xs font-bold transition-all bg-white text-slate-700 border-slate-200 hover:border-rose-300';
  });
  el.className = 'modal-size-pill px-3 py-1.5 rounded-xl border text-xs font-bold transition-all bg-[#FF758C] text-white border-[#FF758C]';
}

function selectModalColor(col, el) {
  if (!appState.selectedProductForModal) return;
  appState.selectedProductForModal.selectedColor = col;
  document.querySelectorAll('.modal-color-pill').forEach(btn => {
    btn.className = 'modal-color-pill px-3 py-1 rounded-lg border text-xs font-medium transition-all bg-rose-50 text-slate-700 border-rose-100 hover:border-rose-300';
  });
  el.className = 'modal-color-pill px-3 py-1 rounded-lg border text-xs font-medium transition-all bg-slate-800 text-white border-slate-800';
}

function changeModalQty(delta) {
  if (!appState.selectedProductForModal) return;
  let q = (appState.selectedProductForModal.quantity || 1) + delta;
  if (q < 1) q = 1;
  appState.selectedProductForModal.quantity = q;
  const qEl = document.getElementById('modal-qty-val');
  if (qEl) qEl.textContent = q;
}

function addModalProductToCart() {
  const item = appState.selectedProductForModal;
  if (!item) return;

  addToCart(item, item.selectedSize, item.quantity, item.selectedColor);
  closeQuickView();
  openCartDrawer();
}

function orderModalProductDirectly() {
  const item = appState.selectedProductForModal;
  if (!item) return;

  addToCart(item, item.selectedSize, item.quantity, item.selectedColor);
  closeQuickView();
  openCheckoutModal();
}

// -------------------------------------------------------------
// Cart Management
// -------------------------------------------------------------
function addToCartWithDefaultSize(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;
  const defSize = product.sizes && product.sizes.length ? product.sizes[0] : 'Standard';
  addToCart(product, defSize, 1);
  showToast(`🛒 "${product.nameBn || product.name}" কার্টে যোগ হয়েছে!`);
}

function directOrderNow(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;
  const defSize = product.sizes && product.sizes.length ? product.sizes[0] : 'Standard';
  addToCart(product, defSize, 1);
  openCheckoutModal();
}

function addToCart(product, size = 'Standard', qty = 1, color = '') {
  const cartItemIndex = appState.cart.findIndex(
    item => item.id === product.id && item.size === size && (color ? item.color === color : true)
  );

  if (cartItemIndex > -1) {
    appState.cart[cartItemIndex].quantity += qty;
  } else {
    appState.cart.push({
      id: product.id,
      name: product.name,
      nameBn: product.nameBn || product.name,
      price: product.price,
      image: product.image,
      size: size,
      color: color || (product.colors && product.colors[0]) || '',
      quantity: qty
    });
  }

  saveCart();
  updateCartUI();
  bumpCartButton();
}

function saveCart() {
  localStorage.setItem('eluno_cart', JSON.stringify(appState.cart));
}

function updateCartItemQty(index, delta) {
  if (!appState.cart[index]) return;
  appState.cart[index].quantity += delta;
  if (appState.cart[index].quantity <= 0) {
    appState.cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

function removeCartItem(index) {
  appState.cart.splice(index, 1);
  saveCart();
  updateCartUI();
  showToast('পণ্যটি কার্ট থেকে সরানো হয়েছে');
}

function clearCart() {
  appState.cart = [];
  appState.appliedPromo = null;
  saveCart();
  updateCartUI();
}

function bumpCartButton() {
  document.querySelectorAll('.cart-btn-trigger').forEach(btn => {
    btn.classList.add('cart-bump');
    setTimeout(() => btn.classList.remove('cart-bump'), 400);
  });
}

function updateCartUI() {
  const totalCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update Badge Counts
  document.querySelectorAll('.cart-badge-count').forEach(badge => {
    if (totalCount > 0) {
      badge.textContent = totalCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  const cartList = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const drawerFooter = document.getElementById('cart-drawer-footer');

  if (appState.cart.length === 0) {
    if (cartList) cartList.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (drawerFooter) drawerFooter.classList.add('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (drawerFooter) drawerFooter.classList.remove('hidden');

    if (cartList) {
      cartList.innerHTML = appState.cart.map((item, index) => `
        <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <img src="${item.image}" alt="${item.nameBn}" class="w-14 h-14 rounded-xl object-cover border border-slate-200" />
          <div class="flex-1 min-w-0">
            <h5 class="text-xs font-bold text-slate-800 truncate">${item.nameBn}</h5>
            <div class="text-[10px] text-slate-400 mt-0.5">সাইজ: ${item.size} ${item.color ? `| ${item.color}` : ''}</div>
            <div class="text-xs font-black text-[#FF758C] mt-1">৳${item.price.toLocaleString()}</div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <button onclick="removeCartItem(${index})" class="text-slate-400 hover:text-rose-500 text-xs p-1">✕</button>
            <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
              <button onclick="updateCartItemQty(${index}, -1)" class="px-2 py-0.5 hover:bg-slate-100 font-bold">-</button>
              <span class="px-2 py-0.5 font-bold">${item.quantity}</span>
              <button onclick="updateCartItemQty(${index}, 1)" class="px-2 py-0.5 hover:bg-slate-100 font-bold">+</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  updateCartSummary();
}

function calculateSubtotal() {
  return appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateDiscount(subtotal) {
  if (!appState.appliedPromo) return 0;
  if (appState.appliedPromo.discountPercent) {
    return Math.round((subtotal * appState.appliedPromo.discountPercent) / 100);
  }
  if (appState.appliedPromo.discountAmount) {
    return Math.min(subtotal, appState.appliedPromo.discountAmount);
  }
  return 0;
}

function updateCartSummary() {
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const isFreeDelivery = subtotal >= appState.freeDeliveryThreshold;
  const delivery = isFreeDelivery ? 0 : appState.deliveryCost;
  const grandTotal = Math.max(0, subtotal - discount + delivery);

  // Free shipping progress bar
  const shippingText = document.getElementById('free-shipping-text');
  const shippingBar = document.getElementById('free-shipping-progress');
  if (shippingText && shippingBar) {
    if (isFreeDelivery) {
      shippingText.innerHTML = `🎉 অভিনন্দন! আপনি <strong>ফ্রি ডেলিভারি</strong> পাচ্ছেন!`;
      shippingBar.style.width = '100%';
      shippingBar.className = 'h-full bg-emerald-500 transition-all duration-300';
    } else {
      const remaining = appState.freeDeliveryThreshold - subtotal;
      const pct = Math.min(100, (subtotal / appState.freeDeliveryThreshold) * 100);
      shippingText.innerHTML = `আর মাত্র <strong>৳${remaining.toLocaleString()}</strong> টাকার শপিং করলেই ফ্রি ডেলিভারি!`;
      shippingBar.style.width = `${pct}%`;
      shippingBar.className = 'h-full bg-[#FF758C] transition-all duration-300';
    }
  }

  // Drawer Footer Totals
  const subEl = document.getElementById('cart-subtotal');
  const disRow = document.getElementById('cart-discount-row');
  const disVal = document.getElementById('cart-discount-val');
  const delEl = document.getElementById('cart-delivery');
  const totalEl = document.getElementById('cart-grand-total');

  if (subEl) subEl.textContent = `৳${subtotal.toLocaleString()}`;
  if (delEl) delEl.textContent = isFreeDelivery ? 'ফ্রি' : `৳${delivery}`;
  if (totalEl) totalEl.textContent = `৳${grandTotal.toLocaleString()}`;

  if (disRow && disVal) {
    if (discount > 0) {
      disRow.classList.remove('hidden');
      disVal.textContent = `-৳${discount.toLocaleString()}`;
    } else {
      disRow.classList.add('hidden');
    }
  }
}

function applyPromoCode() {
  const input = document.getElementById('promo-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast('⚠️ অনুগ্রহ করে একটি কুপন কোড লিখুন');
    return;
  }

  if (PROMO_CODES[code]) {
    appState.appliedPromo = { code, ...PROMO_CODES[code] };
    updateCartSummary();
    showToast(`✅ কুপন "${code}" সফলভাবে যুক্ত হয়েছে!`);
    input.value = '';
  } else {
    showToast('❌ দুঃখিত, কুপন কোডটি সঠিক নয়');
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('active');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.remove('active');
}

// -------------------------------------------------------------
// Wishlist Management
// -------------------------------------------------------------
function toggleWishlist(productId) {
  const index = appState.wishlist.indexOf(productId);
  if (index > -1) {
    appState.wishlist.splice(index, 1);
    showToast('উইশলিস্ট থেকে সরানো হয়েছে');
  } else {
    appState.wishlist.push(productId);
    showToast('💖 পছন্দের তালিকায় যোগ করা হয়েছে');
  }
  localStorage.setItem('eluno_wishlist', JSON.stringify(appState.wishlist));
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  const count = appState.wishlist.length;
  document.querySelectorAll('.wishlist-badge-count').forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

function openWishlistModal() {
  const modal = document.getElementById('wishlist-modal');
  const container = document.getElementById('wishlist-items-list');
  if (!modal || !container) return;

  const items = appState.products.filter(p => appState.wishlist.includes(p.id));

  if (items.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <div class="text-4xl mb-2">💔</div>
        <p class="text-xs">আপনার পছন্দের তালিকা বর্তমানে খালি।</p>
      </div>
    `;
  } else {
    container.innerHTML = items.map(p => `
      <div class="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
        <div class="flex items-center gap-3">
          <img src="${p.image}" class="w-12 h-12 rounded-xl object-cover" />
          <div>
            <h5 class="text-xs font-bold text-slate-800">${p.nameBn || p.name}</h5>
            <div class="text-xs font-black text-[#FF758C]">৳${p.price.toLocaleString()}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="directOrderNow(${p.id}); closeWishlistModal();" class="px-3 py-1.5 bg-[#FF758C] text-white text-[11px] font-bold rounded-xl">অর্ডার</button>
          <button onclick="toggleWishlist(${p.id}); openWishlistModal();" class="text-slate-400 hover:text-rose-500 text-xs p-1">✕</button>
        </div>
      </div>
    `).join('');
  }

  modal.classList.add('active');
}

function closeWishlistModal() {
  const modal = document.getElementById('wishlist-modal');
  if (modal) modal.classList.remove('active');
}

// -------------------------------------------------------------
// Checkout & Payment Logic (COD, bKash, Nagad)
// -------------------------------------------------------------
function togglePaymentBoxes() {
  const selected = document.querySelector('input[name="payment_method"]:checked')?.value;
  const bkashBox = document.getElementById('bkash-input-box');
  const nagadBox = document.getElementById('nagad-input-box');

  if (bkashBox) bkashBox.classList.add('hidden');
  if (nagadBox) nagadBox.classList.add('hidden');

  if (selected === 'bKash' && bkashBox) {
    bkashBox.classList.remove('hidden');
  } else if (selected === 'Nagad' && nagadBox) {
    nagadBox.classList.remove('hidden');
  }
}

function openCheckoutModal() {
  if (appState.cart.length === 0) {
    showToast('⚠️ আপনার কার্টে কোনো পণ্য নেই!');
    return;
  }
  closeCartDrawer();
  updateCheckoutSummary();
  togglePaymentBoxes();
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

function updateCheckoutSummary() {
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const isFreeDelivery = subtotal >= appState.freeDeliveryThreshold;
  const delivery = isFreeDelivery ? 0 : appState.deliveryCost;
  const grandTotal = Math.max(0, subtotal - discount + delivery);

  const listEl = document.getElementById('checkout-items-list');
  if (listEl) {
    listEl.innerHTML = appState.cart.map(item => `
      <div class="flex items-center justify-between py-1.5 border-b border-rose-100 text-xs">
        <div class="flex items-center gap-2">
          <img src="${item.image}" class="w-8 h-8 rounded-lg object-cover" />
          <div>
            <div class="font-bold text-slate-800 line-clamp-1">${item.nameBn}</div>
            <div class="text-[10px] text-slate-400">পরিমাণ: ${item.quantity} | সাইজ: ${item.size}</div>
          </div>
        </div>
        <div class="font-bold text-slate-900">৳${(item.price * item.quantity).toLocaleString()}</div>
      </div>
    `).join('');
  }

  const subEl = document.getElementById('checkout-subtotal');
  const disEl = document.getElementById('checkout-discount');
  const delEl = document.getElementById('checkout-delivery');
  const totalEl = document.getElementById('checkout-total');

  if (subEl) subEl.textContent = `৳${subtotal.toLocaleString()}`;
  if (disEl) disEl.textContent = discount > 0 ? `-৳${discount.toLocaleString()}` : '৳০';
  if (delEl) delEl.textContent = isFreeDelivery ? 'ফ্রি' : `৳${delivery}`;
  if (totalEl) totalEl.textContent = `৳${grandTotal.toLocaleString()}`;
}

// -------------------------------------------------------------
// Submit & Save Complete Order
// -------------------------------------------------------------
function submitOrder(e) {
  e.preventDefault();

  const name = document.getElementById('customer_name')?.value.trim();
  const phone = document.getElementById('customer_phone')?.value.trim();
  const address = document.getElementById('customer_address')?.value.trim();
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'Cash on Delivery';
  const notes = document.getElementById('customer_notes')?.value.trim();

  // Basic validation
  if (!name || !phone || !address) {
    showToast('⚠️ অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর ও সম্পূর্ণ ঠিকানা দিন');
    return;
  }

  if (phone.length < 11) {
    showToast('⚠️ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
    return;
  }

  // Payment Specific Validation
  let paymentDetails = {
    method: paymentMethod,
    senderNumber: '',
    trxId: ''
  };

  if (paymentMethod === 'bKash') {
    const bSender = document.getElementById('bkash_sender')?.value.trim();
    const bTrx = document.getElementById('bkash_trxid')?.value.trim();
    if (!bSender || !bTrx) {
      showToast('⚠️ অনুগ্রহ করে যে নম্বর থেকে বিকাশ করেছেন এবং TrxID দিন');
      return;
    }
    paymentDetails.senderNumber = bSender;
    paymentDetails.trxId = bTrx;
  } else if (paymentMethod === 'Nagad') {
    const nSender = document.getElementById('nagad_sender')?.value.trim();
    const nTrx = document.getElementById('nagad_trxid')?.value.trim();
    if (!nSender || !nTrx) {
      showToast('⚠️ অনুগ্রহ করে যে নম্বর থেকে নগদ করেছেন এবং TrxID দিন');
      return;
    }
    paymentDetails.senderNumber = nSender;
    paymentDetails.trxId = nTrx;
  }

  // Calculate totals
  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const isFreeDelivery = subtotal >= appState.freeDeliveryThreshold;
  const delivery = isFreeDelivery ? 0 : appState.deliveryCost;
  const grandTotal = Math.max(0, subtotal - discount + delivery);
  const orderId = 'ELN-' + Math.floor(100000 + Math.random() * 900000);
  
  const now = new Date();
  const orderDate = now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
  const orderTime = now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });

  const orderData = {
    orderId,
    orderDate,
    orderTime,
    status: 'Pending', // Pending, Processing, Shipped, Delivered, Cancelled
    customer: { name, phone, address, notes, deliveryZone: appState.deliveryZone },
    payment: paymentDetails,
    items: [...appState.cart],
    subtotal,
    discount,
    delivery,
    grandTotal
  };

  // PERSIST ORDER TO LOCAL STORAGE FOR ADMIN PANEL
  const existingOrders = getStoredOrders();
  existingOrders.unshift(orderData);
  saveStoredOrders(existingOrders);

  // Close checkout modal
  closeCheckoutModal();

  // Clear cart
  clearCart();

  // Show Success Receipt Modal
  showOrderSuccessModal(orderData);
}

function showOrderSuccessModal(order) {
  const modal = document.getElementById('order-success-modal');
  const container = document.getElementById('receipt-container');
  if (!modal || !container) return;

  const paymentInfoText = order.payment.method === 'Cash on Delivery'
    ? '💵 ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য দিন)'
    : `📱 ${order.payment.method} | প্রেরক: ${order.payment.senderNumber} | TrxID: ${order.payment.trxId}`;

  container.innerHTML = `
    <div id="printable-receipt" class="bg-white p-4 sm:p-6 rounded-3xl border border-rose-200">
      
      <!-- Receipt Header -->
      <div class="text-center pb-4 border-b border-dashed border-rose-200">
        <div class="inline-block px-3 py-1 bg-rose-100 text-[#FF758C] rounded-full text-xs font-bold mb-2">
          অর্ডারটি সফল হয়েছে! 🎉
        </div>
        <h3 class="text-2xl font-black text-slate-800">El<span class="text-[#FF758C]">uno</span></h3>
        <p class="text-xs text-rose-500 italic">Made for Little Moments.</p>
        <p class="text-xs text-slate-600 mt-2">অর্ডার আইডি: <strong class="text-slate-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">#${order.orderId}</strong></p>
        <p class="text-[11px] text-slate-400 mt-0.5">তারিখ ও সময়: ${order.orderDate}, ${order.orderTime}</p>
      </div>

      <!-- Customer Info -->
      <div class="py-3 border-b border-rose-100 text-xs space-y-1">
        <div><strong>গ্রাহকের নাম:</strong> ${order.customer.name}</div>
        <div><strong>মোবাইল:</strong> ${order.customer.phone}</div>
        <div><strong>ঠিকানা:</strong> ${order.customer.address} (${order.customer.deliveryZone === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'})</div>
        <div><strong>পেমেন্ট মেথড:</strong> ${paymentInfoText}</div>
        ${order.customer.notes ? `<div><strong>বিশেষ নোট:</strong> ${order.customer.notes}</div>` : ''}
      </div>

      <!-- Itemized Table -->
      <div class="py-3 border-b border-dashed border-rose-200 text-xs">
        <div class="font-bold text-slate-800 mb-2">অর্ডার করা পণ্যসমূহ:</div>
        <div class="space-y-1.5">
          ${order.items.map(item => `
            <div class="flex justify-between items-center text-slate-700">
              <span>${item.nameBn} (${item.size}) × ${item.quantity}</span>
              <span class="font-bold">৳${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Financial Calculation -->
      <div class="py-3 text-xs space-y-1">
        <div class="flex justify-between text-slate-500">
          <span>সাব-টোটাল:</span>
          <span>৳${order.subtotal.toLocaleString()}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="flex justify-between text-rose-600 font-bold">
            <span>কুপন ছাড়:</span>
            <span>-৳${order.discount.toLocaleString()}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-slate-500">
          <span>ডেলিভারি চার্জ:</span>
          <span>${order.delivery === 0 ? 'ফ্রি' : `৳${order.delivery}`}</span>
        </div>
        <div class="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-rose-200">
          <span>সর্বমোট প্রদেয়:</span>
          <span class="text-[#FF758C]">৳${order.grandTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <!-- WhatsApp Confirmation & Actions -->
    <div class="mt-5 space-y-2.5">
      <button 
        onclick="sendOrderWhatsApp('${order.orderId}')"
        class="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>হোয়াটসঅ্যাপে রসিদ পাঠান / নিশ্চিত করুন</span>
      </button>

      <div class="flex gap-2">
        <button 
          onclick="window.print()"
          class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
          🖨️ ইনভয়েস প্রিন্ট
        </button>
        <button 
          onclick="closeOrderSuccessModal()"
          class="flex-1 py-2.5 bg-[#FF758C] hover:bg-[#E2556F] text-white font-bold text-xs rounded-xl transition-all">
          সম্পন্ন করুন
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function sendOrderWhatsApp(orderId) {
  const orders = getStoredOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  const waNum = (appState.settings.whatsapp || '8801700000000').replace(/[^0-9]/g, '');

  let text = `*New Order: ${order.orderId} - Eluno*\n`;
  text += `------------------------------------\n`;
  text += `👤 *Customer:* ${order.customer.name}\n`;
  text += `📞 *Phone:* ${order.customer.phone}\n`;
  text += `📍 *Address:* ${order.customer.address} (${order.customer.deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})\n`;
  text += `💳 *Payment Method:* ${order.payment.method}\n`;
  if (order.payment.method !== 'Cash on Delivery') {
    text += `   - Sender No: ${order.payment.senderNumber}\n`;
    text += `   - TrxID: ${order.payment.trxId}\n`;
  }
  if (order.customer.notes) {
    text += `📝 *Notes:* ${order.customer.notes}\n`;
  }
  text += `\n*Items Ordered:*\n`;
  order.items.forEach((item, i) => {
    text += `${i + 1}. ${item.nameBn} (${item.size}) x ${item.quantity} = ৳${item.price * item.quantity}\n`;
  });
  text += `\n*Total Amount:* ৳${order.grandTotal.toLocaleString()}\n`;
  text += `------------------------------------`;

  const url = `https://wa.me/${waNum}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('order-success-modal');
  if (modal) modal.classList.remove('active');
}

// -------------------------------------------------------------
// Toast Notification
// -------------------------------------------------------------
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="text-sm">🌸</span>
    <span class="flex-1 text-xs font-semibold">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

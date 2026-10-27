// =========================================================
// ELUNO - Baby Store & Nursery Essentials
// Central Data & Local Storage Engine
// =========================================================

// Default Store Configuration
const DEFAULT_SETTINGS = {
  storeName: "Eluno",
  tagline: "Made for Little Moments.",
  announcement: "🎉 Eluno-র প্রিমিয়াম কালেকশনে ১০% ছাড়! কোড: MOMENTS10",
  hotline: "+880 1700-000000",
  whatsapp: "8801700000000",
  email: "support@eluno.com",
  address: "বনানী, ঢাকা - ১২১৩, বাংলাদেশ",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  bkashNumber: "01700-000000 (Personal)",
  nagadNumber: "01800-000000 (Personal)",
  deliveryInside: 60,
  deliveryOutside: 120,
  freeDeliveryThreshold: 2500,
  adminPin: "1234",
  fontFamilyBn: "Hind Siliguri",
  fontFamilyEn: "Quicksand",
  fontSizeScale: "normal",

  // Specific Element Typography Controls
  headingFont: "Quicksand",
  headingSize: "100%",
  productTitleFont: "Hind Siliguri",
  productTitleSize: "0.875rem",
  priceSize: "1.15rem",
  bodyFont: "Hind Siliguri",
  bodySize: "0.85rem",

  // Website Content & Banner Texts
  heroBadge: "✨ Little Moments, Big Love",
  heroTitle: "শিশুর প্রথম হাসি আর প্রতিটি মিষ্টি মুহূর্তের পরম যত্ন।",
  heroSubtitle: "১০০% সার্টিফাইড অর্গানিক কটন বেবি পোশাক, প্রাকৃতিক কাঠের মন্টেসরি খেলনা ও প্রিমিয়াম গিফট হ্যাম্পার—যা আপনার ছোট্ট সোনামণিকে দেবে অতুলনীয় আরাম ও নিরাপদ ভালোবাসা।",
  heroImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
  heroBtn1: "কালেকশন দেখুন",
  heroBtn2: "🎁 বেবি গিফট বক্স",

  catalogBadge: "🌸 আমাদের স্পেশাল কালেকশন",
  catalogTitle: "আপনার সোনামণির জন্য সেরা পণ্যটি বেছে নিন",
  catalogSubtitle: "নবজাতক থেকে ৫ বছর বয়সী বাচ্চাদের জন্য প্রিমিয়াম ড্রেস, মন্টেসরি খেলনা ও উপহার সামগ্রী",

  footerAbout: "শিশুর সংবেদনশীল ত্বকের জন্য পরম যত্ন ও প্রিমিয়াম ভালোবাসার স্পর্শ। প্রতিটি মিষ্টি মুহূর্ত আনন্দময় হোক।",

  faqs: [
    {
      q: "ডেলিভারি চার্জ কত এবং কতদিনে পাব?",
      a: "ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৬০ টাকা এবং ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি পাবেন। ঢাকা সিটির বাইরে চার্জ ১২০ টাকা এবং ২ থেকে ৩ কর্মদিবসে পণ্য পৌঁছানো হয়। ৳২,৫০০ বা তার বেশি শপিংয়ে ডেলিভারি সম্পূর্ণ ফ্রি!"
    },
    {
      q: "ক্যাশ অন ডেলিভারি এবং বিকাশ/নগদে পেমেন্ট কীভাবে করব?",
      a: "আমরা ক্যাশ অন ডেলিভারি সাপোর্ট করি—অর্থাৎ পণ্য হাতে পেয়ে চেক করে মূল্য দিতে পারবেন। এছাড়াও চেকআউটে আমাদের দেওয়া বিকাশ ও নগদ নম্বরে টাকা পাঠিয়ে আপনার নম্বর ও ট্রানজেকশন আইডি (TrxID) দিয়ে অর্ডার কনফার্ম করতে পারেন।"
    },
    {
      q: "সাইজ না মিললে কি পরিবর্তন (Exchange) করা যাবে?",
      a: "অবশ্যই! প্রোডাক্ট হাতে পাওয়ার ৭ দিনের মধ্যে আমাদের জানালে সম্পূর্ণ ফ্রেশ কন্ডিশনে থাকা পোশাকের সাইজ এক্সচেঞ্জ করে দেওয়া হয়।"
    }
  ]
};

// Default Products Data
const defaultProductsData = [
  {
    id: 1,
    name: "Eluno Pure Organic Romper Set",
    nameBn: "ইলুনো পিওর অর্গানিক কটন রম্পার সেট (৩ পিস)",
    category: "newborn",
    categoryName: "Newborn Essentials",
    price: 1250,
    originalPrice: 1550,
    discount: "20% OFF",
    rating: 4.9,
    reviewsCount: 38,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["0-3M", "3-6M", "6-12M"],
    colors: ["Pastel Beige", "Soft Blue", "Honey Gold"],
    description: "১০০% সার্টিফাইড অর্গানিক কটন দিয়ে তৈরি, যা আপনার নবজাতক শিশুর অতি সংবেদনশীল ত্বকের জন্য পরম আরামদায়ক ও নিরাপদ। এতে কোনো ক্ষতিকারক কেমিক্যাল বা ডাই ব্যবহার করা হয়নি। স্ন্যাপ বাটন থাকায় ডায়পার পরিবর্তন করা অত্যন্ত সহজ।",
    inStock: true
  },
  {
    id: 2,
    name: "Pastel Cloud Baby Sleeping Sack",
    nameBn: "প্যাস্টেল ক্লাউড বেবি স্লিপিং স্যুট",
    category: "newborn",
    categoryName: "Newborn Essentials",
    price: 980,
    originalPrice: 1250,
    discount: "22% OFF",
    rating: 4.8,
    reviewsCount: 29,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["0-6M", "6-12M", "1-2Y"],
    colors: ["Cloud White", "Sky Blue", "Blush Pink"],
    description: "রাতে শিশুর শান্তির ঘুমের জন্য সবচেয়ে নিরাপদ স্লিপিং স্যুট। সাধারণ কম্বলের মতো শিশুর মুখে জড়িয়ে যাওয়ার কোনো ভয় নেই। হালকা ও নিঃশ্বাসযোগ্য ফেব্রিক সব ঋতুতেই আরাম দেবে।",
    inStock: true
  },
  {
    id: 3,
    name: "Handcrafted Wooden Montessori Rattle",
    nameBn: "হ্যান্ডক্রাফটেড ন্যাচারাল উডেন র্যাটেল ও টিদার",
    category: "toys",
    categoryName: "Toys & Keepsakes",
    price: 580,
    originalPrice: 720,
    discount: "19% OFF",
    rating: 5.0,
    reviewsCount: 52,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["Standard Size"],
    colors: ["Natural Beech Wood"],
    description: "১০০% প্রাকৃতিক বীচ কাঠ দিয়ে তৈরি নন-টক্সিক ও মসৃণ হ্যান্ডেলযুক্ত র্যাটেল। এটি শিশুর সংবেদনশীল দাঁতের মাড়ির চুলকানি উপশমে চমৎকার কাজ করে এবং শব্দ ও হাতের মোটর স্কিল বৃদ্ধিতে সাহায্য করে।",
    inStock: true
  },
  {
    id: 4,
    name: "Little Moments Keepsake Luxury Gift Box",
    nameBn: "ইলুনো 'Little Moments' লাক্সারি বেবি গিফট হ্যাম্পার",
    category: "giftbox",
    categoryName: "Gift Sets",
    price: 2950,
    originalPrice: 3600,
    discount: "18% OFF",
    rating: 5.0,
    reviewsCount: 46,
    isBestSeller: true,
    isNew: true,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["Deluxe Box"],
    colors: ["Baby Pink & Cream", "Pastel Sky Blue"],
    description: "নতুন জন্ম নেওয়া সোনামণি ও তার নতুন মায়ের জন্য পরম ভালোবাসার উপহার। এতে রয়েছে ২টি প্রিমিয়াম রম্পার, কাঠের র্যাটেল, সফট সোয়াডল ব্ল্যাঙ্কেট এবং কাস্টমাইজড শুভেচ্ছা কার্ড।",
    inStock: true
  },
  {
    id: 5,
    name: "Pure Cotton Knit Baby Cardigan",
    nameBn: "হ্যান্ড নিটেড সফট কটন বেবি কার্ডিগান সোয়েটার",
    category: "toddler",
    categoryName: "Toddler & Kids",
    price: 1150,
    originalPrice: 1450,
    discount: "21% OFF",
    rating: 4.7,
    reviewsCount: 19,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["6-12M", "1-2Y", "2-3Y"],
    colors: ["Warm Mustard", "Cream White", "Dusty Sage"],
    description: "হালকা ঠান্ডার দিনে আপনার শিশুকে আরামদায়ক উষ্ণতা দিতে প্রিমিয়াম কটন সুতায় বোনা কার্ডিগান। এতে আছে কাঠের ন্যাচারাল বোতাম যা দেখতে যেমন সুন্দর তেমনি ব্যবহারে সুবিধাজনক।",
    inStock: true
  },
  {
    id: 6,
    name: "Organic Muslin Cotton Swaddle Blankets (Set of 2)",
    nameBn: "ইলুনো সফট মসলিন কটন সোয়াডল ব্ল্যাঙ্কেট (২ পিস)",
    category: "nursery",
    categoryName: "Nursery & Bedding",
    price: 890,
    originalPrice: 1150,
    discount: "23% OFF",
    rating: 4.9,
    reviewsCount: 64,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["110cm x 110cm"],
    colors: ["Forest Woodland & Stars", "Floral Boho"],
    description: "যত ধোয়া হবে তত বেশি নরম হবে এই বিশেষ মসলিন সোয়াডল। সোয়াডলিং ছাড়াও নার্সিং কভার, প্রাম কভার বা হালকা চাদর হিসেবে বহুমুখী ব্যবহারে সেরা।",
    inStock: true
  },
  {
    id: 7,
    name: "Cozy Fleece Bear Ear Hooded Romper",
    nameBn: "কিউট বিয়ার ইয়ার ফ্লিস উইন্টার রম্পার",
    category: "newborn",
    categoryName: "Newborn Essentials",
    price: 1390,
    originalPrice: 1750,
    discount: "21% OFF",
    rating: 4.9,
    reviewsCount: 42,
    isBestSeller: true,
    isNew: true,
    image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["0-3M", "3-6M", "6-12M"],
    colors: ["Teddy Brown", "Snow White", "Blush Pink"],
    description: "শীতের হিমেল বাতাসে শিশুকে একদম উষ্ণ ও সুরক্ষিত রাখতে সেরা ফ্লিস রম্পার। হুডিতে রয়েছে মিষ্টি ভাল্লুকের কান যা আপনার সোনামণিকে দেবে অতুলনীয় কিউট লুক।",
    inStock: true
  },
  {
    id: 8,
    name: "Toddler Linen Blend Suspender Pant & Shirt Set",
    nameBn: "টডলার লিনেন সাসপেন্ডার প্যান্ট ও শার্ট সেট",
    category: "toddler",
    categoryName: "Toddler & Kids",
    price: 1650,
    originalPrice: 1950,
    discount: "15% OFF",
    rating: 4.8,
    reviewsCount: 23,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y"],
    colors: ["Olive Green & Beige", "Classic Navy & White"],
    description: "যেকোনো উৎসব, জন্মদিন বা পারিবারিক অনুষ্ঠানে পরানোর জন্য একদম জেন্টলম্যান লুক দেবে এই সাসপেন্ডার সেট। ব্রিদেবল লিনেন-কটন ব্লেন্ড দীর্ঘ সময় পরিয়ে রাখলেও ঘাম জমবে না।",
    inStock: true
  },
  {
    id: 9,
    name: "Rainbow Silicone Stacking & Teething Toy",
    nameBn: "বিপিএ-মুক্ত রেইনবো সিলিকন স্ট্যাকিং টয়",
    category: "toys",
    categoryName: "Toys & Keepsakes",
    price: 750,
    originalPrice: 950,
    discount: "21% OFF",
    rating: 4.9,
    reviewsCount: 31,
    isBestSeller: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["6 Pieces Set"],
    colors: ["Pastel Rainbow", "Earth Tones"],
    description: "১০০% ফুড-গ্রেড বিপিএ-মুক্ত সিলিকন। সহজে ধোয়া ও জীবাণুমুক্ত করা যায়। শিশুর রঙ চেনা, হাত-চোখের সমন্বয় ও মোটর স্কিল বিকাশে অত্যন্ত কার্যকরী মন্টেসরি খেলনা।",
    inStock: true
  },
  {
    id: 10,
    name: "Soft Sole Genuine Leather First Walkers",
    nameBn: "সফট সোল জেনুইন লেদার বেবি ফার্স্ট ওয়াকার শুজ",
    category: "toddler",
    categoryName: "Toddler & Kids",
    price: 1100,
    originalPrice: 1350,
    discount: "19% OFF",
    rating: 4.8,
    reviewsCount: 27,
    isBestSeller: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["0-6M", "6-12M", "12-18M"],
    colors: ["Caramel Tan", "Snow White", "Rose Blush"],
    description: "শিশু যখন প্রথম পা ফেলতে শেখে, তখন পায়ের স্বাভাবিক হাড় গঠনে সাহায্য করে এই নরম নন-স্লিপ লেদার জুতো। পায়ে সহজে পরা যায় কিন্তু সহজে খুলে পড়ে না।",
    inStock: true
  },
  {
    id: 11,
    name: "Organic Bamboo Hooded Baby Bath Towel",
    nameBn: "সফট অর্গানিক ব্যাম্বু হুডেড বেবি বাথ টাওয়েল",
    category: "nursery",
    categoryName: "Nursery & Bedding",
    price: 850,
    originalPrice: 1100,
    discount: "23% OFF",
    rating: 4.9,
    reviewsCount: 35,
    isBestSeller: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["85cm x 85cm"],
    colors: ["Cream Teddy Bear", "Warm Vanilla"],
    description: "স্বাভাবিক সুতির চেয়ে ৩ গুণ দ্রুত পানি শুষে নেয় এই ব্যাম্বু ফাইবার টাওয়েল। কিউট বিয়ার হুড শিশুকে গোসলের পর ঠান্ডার হাত থেকে রক্ষা করে ও চমৎকার উষ্ণতা দেয়।",
    inStock: true
  },
  {
    id: 12,
    name: "Baby Milestone Memory Journal & Keepsake",
    nameBn: "ইলুনো বেবি মেমোরি জার্নাল ও মাইলস্টোন কার্ড",
    category: "giftbox",
    categoryName: "Gift Sets",
    price: 950,
    originalPrice: 1250,
    discount: "24% OFF",
    rating: 5.0,
    reviewsCount: 41,
    isBestSeller: true,
    isNew: true,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80",
    images: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80"
    ],
    sizes: ["Hardcover 80 Pages"],
    colors: ["Rose Gold Embossed Pastel"],
    description: "সন্তানের জন্ম থেকে ৫ বছর বয়স পর্যন্ত প্রতিটি প্রথম কথা, প্রথম হাসি ও অমূল্য মুহূর্ত বাঁধাই করে রাখার জন্য প্রিমিয়াম মেমোরি বই। প্রতিটি পৃষ্ঠায় রয়েছে ছবি ও অনুভূতি লেখার মিষ্টি জায়গা।",
    inStock: true
  }
];

// Categories configuration
const categoriesData = [
  { id: "all", name: "সব কালেকশন", nameEn: "All Products", icon: "✨" },
  { id: "newborn", name: "নবজাতক (০-১২ মাস)", nameEn: "Newborn Essentials", icon: "🍼" },
  { id: "toddler", name: "টডলার ও কিডস", nameEn: "Toddler & Kids", icon: "🧸" },
  { id: "toys", name: "খেলনা ও টিদার", nameEn: "Toys & Keepsakes", icon: "🪵" },
  { id: "nursery", name: "বেডিং ও সোয়াডল", nameEn: "Nursery & Bedding", icon: "🛏️" },
  { id: "giftbox", name: "গিফট বক্স হ্যাম্পার", nameEn: "Gift Sets", icon: "🎁" }
];

// -------------------------------------------------------------
// Local Storage Helper Functions
// -------------------------------------------------------------

function getStoredProducts() {
  try {
    const raw = localStorage.getItem('eluno_products');
    if (!raw) {
      localStorage.setItem('eluno_products', JSON.stringify(defaultProductsData));
      return defaultProductsData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading eluno_products:', err);
    return defaultProductsData;
  }
}

function saveStoredProducts(products) {
  try {
    localStorage.setItem('eluno_products', JSON.stringify(products));
  } catch (err) {
    console.error('Error saving eluno_products:', err);
  }
}

function getStoredSettings() {
  try {
    const raw = localStorage.getItem('eluno_settings');
    if (!raw) {
      localStorage.setItem('eluno_settings', JSON.stringify(DEFAULT_SETTINGS));
      return { ...DEFAULT_SETTINGS };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading eluno_settings:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

function saveStoredSettings(settings) {
  try {
    localStorage.setItem('eluno_settings', JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving eluno_settings:', err);
  }
}

function getStoredOrders() {
  try {
    const raw = localStorage.getItem('eluno_orders');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading eluno_orders:', err);
    return [];
  }
}

function saveStoredOrders(orders) {
  try {
    localStorage.setItem('eluno_orders', JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving eluno_orders:', err);
  }
}

// Global reference for backward compatibility
const productsData = getStoredProducts();

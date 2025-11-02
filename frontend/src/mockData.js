// Mock Data untuk Cafe Loreomah

export const sliderData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
    title: "Selamat Datang di Cafe Loreomah",
    description: "Nikmati kopi specialty terbaik Indonesia dengan suasana hangat dan nyaman"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200",
    title: "Kopi Nusantara Terbaik",
    description: "Dari perkebunan terbaik Indonesia, disajikan dengan penuh cinta"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200",
    title: "Tempat Berkumpul Favorit",
    description: "Ruang hangat untuk bertemu teman, keluarga, dan momen spesial Anda"
  }
];

export const menuCategories = [
  {
    id: 1,
    name: "FOOD",
    title: "Food",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
    description: "Berbagai pilihan makanan utama yang lezat untuk menemani kopi Anda"
  },
  {
    id: 2,
    name: "SNACKS",
    title: "Snacks",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
    description: "Camilan ringan yang pas untuk dinikmati sambil ngobrol santai"
  },
  {
    id: 3,
    name: "COFFEE",
    title: "Coffee",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500",
    description: "Kopi specialty dari berbagai daerah terbaik di Indonesia"
  },
  {
    id: 4,
    name: "NON-COFFEE",
    title: "Non-Coffee",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
    description: "Minuman segar non-kopi untuk pilihan yang lebih beragam"
  }
];

export const menuItems = {
  food: [
    { id: 1, name: "Nasi Goreng Loreomah", price: 35000, category: "food", description: "Lemon / Garlic / Beans" },
    { id: 2, name: "Mie Goreng Loreomah", price: 32000, category: "food", description: "Bacon / Shrimp / Garlic" },
    { id: 3, name: "Ayam Goreng Cabe Ijo", price: 28000, category: "food", description: "Lemon / Garlic / Beans" },
    { id: 4, name: "Ayam Jawara Bakar", price: 38000, category: "food", description: "Bacon / Shrimp / Garlic" },
    { id: 5, name: "Ayam Jawara Goreng", price: 30000, category: "food", description: "Lamb / Wine / Butter" },
    { id: 6, name: "Nasi Solo", price: 25000, category: "food", description: "Lamb / Wine / Butter" },
    { id: 7, name: "Asem-Asem Patin + Nasi Wukul", price: 36000, category: "food", description: "Oysters / Veggie / Ginger" },
    { id: 8, name: "Bakso", price: 20000, category: "food", description: "Oysters / Veggie / Ginger" }
  ],
  snacks: [
    { id: 9, name: "French Fries", price: 18000, category: "snacks", description: "Kentang goreng crispy dengan saus pilihan" },
    { id: 10, name: "Onion Rings", price: 20000, category: "snacks", description: "Bawang bombay goreng tepung renyah" },
    { id: 11, name: "Chicken Wings", price: 25000, category: "snacks", description: "Sayap ayam dengan bumbu spesial" },
    { id: 12, name: "Nachos", price: 22000, category: "snacks", description: "Tortilla chips dengan keju leleh dan salsa" },
    { id: 13, name: "Spring Rolls", price: 19000, category: "snacks", description: "Lumpia sayuran segar" },
    { id: 14, name: "Cheese Sticks", price: 21000, category: "snacks", description: "Stik keju mozzarella goreng" }
  ],
  coffee: [
    { id: 15, name: "Espresso", price: 15000, category: "coffee", description: "Single shot kopi hitam pekat" },
    { id: 16, name: "Americano", price: 18000, category: "coffee", description: "Espresso dengan air panas" },
    { id: 17, name: "Cappuccino", price: 22000, category: "coffee", description: "Espresso dengan susu dan foam" },
    { id: 18, name: "Latte", price: 24000, category: "coffee", description: "Espresso dengan steamed milk" },
    { id: 19, name: "Kopi Susu Loreomah", price: 20000, category: "coffee", description: "Signature kopi susu dengan gula aren" },
    { id: 20, name: "Vietnamese Coffee", price: 23000, category: "coffee", description: "Kopi Vietnam dengan susu kental manis" },
    { id: 21, name: "Caramel Macchiato", price: 26000, category: "coffee", description: "Espresso dengan susu dan caramel" },
    { id: 22, name: "Mocha", price: 25000, category: "coffee", description: "Espresso dengan cokelat dan susu" }
  ],
  "non-coffee": [
    { id: 23, name: "Teh Tarik", price: 15000, category: "non-coffee", description: "Teh susu tarik khas Malaysia" },
    { id: 24, name: "Hot Chocolate", price: 22000, category: "non-coffee", description: "Cokelat panas dengan whipped cream" },
    { id: 25, name: "Matcha Latte", price: 25000, category: "non-coffee", description: "Teh hijau Jepang dengan susu" },
    { id: 26, name: "Fresh Orange Juice", price: 18000, category: "non-coffee", description: "Jus jeruk segar tanpa gula" },
    { id: 27, name: "Lemon Tea", price: 16000, category: "non-coffee", description: "Teh lemon segar dingin" },
    { id: 28, name: "Thai Tea", price: 20000, category: "non-coffee", description: "Teh Thailand dengan susu" }
  ]
};

export const storyData = {
  title: "CERITA KAMI",
  paragraphs: [
    "Dimulai dari sebuah impian sederhana untuk menghadirkan kopi berkualitas dengan harga terjangkau, Cafe Loreomah hadir di tengah masyarakat pada tahun 2018. Berlokasi di jantung kota, kami percaya bahwa setiap cangkir kopi memiliki cerita dan kehangatan tersendiri.",
    "Dengan menggunakan biji kopi pilihan dari berbagai perkebunan terbaik di Indonesia, kami berkomitmen untuk memberikan pengalaman minum kopi yang tak terlupakan. Setiap barista kami dilatih dengan dedikasi tinggi untuk memastikan setiap sajian sempurna.",
    "Cafe Loreomah bukan hanya tempat minum kopi, tetapi juga ruang untuk berkumpul, berbagi cerita, dan menciptakan kenangan indah bersama orang-orang terkasih. Kami bangga menjadi bagian dari perjalanan kopi Indonesia."
  ],
  image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600"
};

export const galleryImages = [
  { id: 1, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", alt: "Cafe Interior" },
  { id: 2, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400", alt: "Coffee Art" },
  { id: 3, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", alt: "Barista" },
  { id: 4, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", alt: "Coffee Beans" },
  { id: 5, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400", alt: "Latte Art" },
  { id: 6, image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400", alt: "Coffee Shop" },
  { id: 7, image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400", alt: "Coffee Time" },
  { id: 8, image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400", alt: "Espresso Machine" },
  { id: 9, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400", alt: "Coffee Cup" },
  { id: 10, image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400", alt: "Cafe Ambience" },
  { id: 11, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400", alt: "Coffee Pouring" },
  { id: 12, image: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400", alt: "Coffee Moment" }
];

export const contactData = {
  instagram: "@cafeloreomah",
  facebook: "Cafe Loreomah Official",
  email: "hello@cafeloreomah.com",
  tiktok: "cafeloreomah",
  youtube: "Cafe Loreomah",
  phone: "+62 812 3456 7890",
  address: "Jl. Raya Contoh No. 123, Surabaya, Jawa Timur 60111",
  maps: "https://maps.google.com"
};

export const aboutData = {
  title: "Tentang Kami",
  subtitle: "Cafe Loreomah - More Than Just Coffee",
  mission: "Misi kami adalah menghadirkan pengalaman kopi terbaik dengan menggunakan biji kopi pilihan dari perkebunan lokal Indonesia, disajikan dalam suasana yang hangat dan ramah.",
  vision: "Menjadi coffee shop pilihan utama yang tidak hanya menyajikan kopi berkualitas, tetapi juga menjadi rumah kedua bagi setiap pengunjung.",
  values: [
    { title: "Kualitas", description: "Hanya menggunakan biji kopi specialty terbaik dari Indonesia" },
    { title: "Kehangatan", description: "Menciptakan suasana yang nyaman dan ramah untuk semua" },
    { title: "Komunitas", description: "Membangun hubungan yang kuat dengan pelanggan dan masyarakat" },
    { title: "Inovasi", description: "Terus berinovasi dalam menu dan pelayanan" }
  ]
};

// Google Drive link for full menu
export const menuDriveLink = "https://drive.google.com/drive/folders/your-folder-id";
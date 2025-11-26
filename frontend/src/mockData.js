// Mock Data untuk Cafe Loreomah
// Most data has been migrated to database via API
// Only keeping fallback data for MenuDetailPage

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









// Google Drive link for full menu
export const menuDriveLink = "https://drive.google.com/drive/folders/your-folder-id";
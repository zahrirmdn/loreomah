import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import API from "../api/api";
import { menuItems as MOCK_MENU_ITEMS, menuCategories as MOCK_CATEGORIES, menuDriveLink } from "../mockData";

const MenuDetailPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Fetch data kategori & item berdasarkan nama kategori
  useEffect(() => {
    // Scroll to top when opening this page or when category changes
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      // ignore in non-browser env
    }

    const fetchData = async () => {
      try {
        const catRes = await API.get(`/api/menu-categories/${category}/`);
        console.log('Category data:', catRes.data); // Debug
        setCategoryInfo(catRes.data);

        const itemsRes = await API.get(`/api/menu-items/${category}/`);
        setItems(itemsRes.data);
      } catch (err) {
        console.error("Gagal memuat detail menu:", err);
        // Fallback to mock data when backend endpoints are not available
        const slug = category?.toString().toLowerCase();
        const foundCat = MOCK_CATEGORIES.find(
          (c) => (c.name || c.title || "").toString().toLowerCase() === slug
        );
        if (foundCat) {
          setCategoryInfo(foundCat);
        } else {
          setCategoryInfo({ title: category, description: "", menu_link: "" });
        }

        const fallbackItems = MOCK_MENU_ITEMS[slug] || [];
        setItems(fallbackItems);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#6A4C2E" }}>
      {/* Header */}
      <div className="py-8 sm:py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-white hover:text-amber-200 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2" size={18} />
            Kembali ke Home
          </Button>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-2">
            {categoryInfo?.title || category}
          </h1>
          <p className="text-center text-amber-100 text-sm sm:text-base md:text-lg px-4">
            {categoryInfo?.description ||
              `Explore our delicious ${category} selection`}
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={item.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-4 sm:py-6">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">
                      {item.name}
                    </h3>
                    <p className="text-amber-100 text-xs sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-6">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      Rp {item.price?.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                {index < items.length - 1 && (
                  <div className="border-b border-dotted border-amber-700"></div>
                )}
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-center text-amber-100 mt-6">
                Belum ada menu untuk kategori ini.
              </p>
            )}
          </div>

          {/* View All Menu Button */}
          <div className="mt-8 sm:mt-10 md:mt-12 text-center">
            {categoryInfo?.menu_link && categoryInfo.menu_link.trim() !== "" ? (
              <a
                href={categoryInfo.menu_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#6A4C2E] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg transition-colors"
                >
                  VIEW ALL MENU
                  <ExternalLink className="ml-2" size={18} />
                </Button>
              </a>
            ) : (
              <div className="text-amber-100 text-xs sm:text-sm px-4">
                <p>Link menu belum tersedia. Admin dapat menambahkan di halaman edit kategori.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailPage;

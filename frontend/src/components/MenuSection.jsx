import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // pastikan ini sudah ada seperti di AdminDashboard

const MenuSection = () => {
  const navigate = useNavigate();
  const [menuCategories, setMenuCategories] = useState([]);

  // Ambil data kategori menu dari backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/api/menu-categories/");
        setMenuCategories(res.data);
      } catch (error) {
        console.error("Gagal memuat kategori menu:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <p
            className="text-xs sm:text-sm uppercase tracking-wider font-semibold mb-2 px-4"
            style={{ color: "#8B6F47" }}
          >
            from the best indonesian specialty coffee to heart-warming foods
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-400 uppercase mb-2">
            Our Menu
          </h2>
          <div
            className="w-16 h-1 mx-auto"
            style={{ backgroundColor: "#6A4C2E" }}
          ></div>
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8 sm:mt-12 md:mt-16">
          {menuCategories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/menu/${category.name.toLowerCase()}`)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg mb-3 sm:mb-4 h-48 sm:h-56 md:h-64">
                <img
                  src={`http://localhost:8000${category.image_url}`}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2 text-center">
                {category.title}
              </h3>
              <p className="text-gray-600 text-center text-xs sm:text-sm leading-relaxed px-2">
                {category.description}
              </p>
            </div>
          ))}

          {/* Jika belum ada data */}
          {menuCategories.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              Belum ada kategori menu yang tersedia.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;

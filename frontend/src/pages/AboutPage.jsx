import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Award, Heart, Users, Lightbulb } from 'lucide-react';

const AboutPage = () => {
  const [aboutData, setAboutData] = useState({
    title: 'Tentang Kami',
    subtitle: '',
    mission: '',
    vision: '',
    values: []
  });

  const valueIcons = {
    'Kualitas': Award,
    'Kehangatan': Heart,
    'Komunitas': Users,
    'Inovasi': Lightbulb
  };

  useEffect(() => {
    API.get('/api/settings/')
      .then(res => setAboutData(res.data.about || aboutData))
      .catch(err => console.error('Failed to load about settings:', err));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div
        className="relative h-64 sm:h-80 md:h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
              {aboutData.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200">{aboutData.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            <div className="bg-amber-50 p-6 sm:p-8 rounded-lg shadow-md">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
                style={{ color: '#6A4C2E' }}
              >
                Misi Kami
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {aboutData.mission}
              </p>
            </div>
            <div className="bg-amber-50 p-6 sm:p-8 rounded-lg shadow-md">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
                style={{ color: '#6A4C2E' }}
              >
                Visi Kami
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {aboutData.vision}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 sm:mb-12 md:mb-16">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {aboutData.values.map((value, index) => {
              const Icon = valueIcons[value.title];
              return (
                <div
                  key={index}
                  className="bg-white p-6 sm:p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow"
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                    style={{ backgroundColor: '#6A4C2E' }}
                  >
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Image Section */}
      <div className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600"
                alt="Coffee Making"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Perjalanan Kami
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                Cafe Loreomah lahir dari kecintaan pada kopi Nusantara dan suasana alam Trawas
                yang sejuk. Kami percaya, secangkir kopi yang baik bukan hanya soal rasa —
                tetapi juga tentang momen, suasana, dan kebersamaan.
              </p>
              <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                Kami menggunakan bahan baku lokal, mendukung petani dan pelaku UMKM, serta
                meracik menu yang seimbang: dari manual brew, kopi susu gula aren, hingga
                pilihan non-kopi dan makanan keluarga. Setiap sajian diracik dengan standar
                konsistensi, agar pengalaman Anda selalu menyenangkan kapan pun berkunjung.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Berlokasi di Jl. Airlangga, Trawas, Mojokerto, Loreomah menjadi tempat singgah
                yang hangat untuk berkumpul, bekerja, atau sekadar menikmati udara pegunungan.
                Terima kasih telah menjadi bagian dari perjalanan kami — sampai jumpa di Loreomah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

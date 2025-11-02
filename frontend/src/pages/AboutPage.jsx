import React from 'react';
import { aboutData } from '../mockData';
import { Award, Heart, Users, Lightbulb } from 'lucide-react';

const AboutPage = () => {
  const valueIcons = {
    'Kualitas': Award,
    'Kehangatan': Heart,
    'Komunitas': Users,
    'Inovasi': Lightbulb
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{aboutData.title}</h1>
            <p className="text-2xl text-gray-200">{aboutData.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-amber-50 p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Misi Kami</h2>
              <p className="text-gray-700 leading-relaxed">{aboutData.mission}</p>
            </div>
            <div className="bg-amber-50 p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Visi Kami</h2>
              <p className="text-gray-700 leading-relaxed">{aboutData.vision}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.values.map((value, index) => {
              const Icon = valueIcons[value.title];
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                  <div className="bg-amber-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Story Image Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600"
                alt="Coffee Making"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Perjalanan Kami</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sejak 2018, Cafe Loreomah telah menjadi bagian dari kehidupan sehari-hari masyarakat. 
                Kami memulai dengan impian sederhana: menghadirkan kopi berkualitas tinggi yang terjangkau 
                untuk semua orang.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dengan dedikasi penuh, kami terus berinovasi dalam setiap aspek - mulai dari pemilihan biji kopi, 
                proses roasting, hingga cara penyajian. Setiap cangkir kopi yang kami sajikan adalah hasil dari 
                passion dan kerja keras tim kami.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Terima kasih kepada semua pelanggan setia kami yang telah menjadikan Cafe Loreomah sebagai 
                bagian dari rutinitas harian. Kami berkomitmen untuk terus memberikan yang terbaik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
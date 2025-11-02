import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { menuItems, menuDriveLink } from '../mockData';
import { Button } from '../components/ui/button';

const MenuDetailPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const categoryKey = category === 'non-coffee' ? 'non-coffee' : category;
  const items = menuItems[categoryKey] || [];

  const categoryTitle = {
    'food': 'Food',
    'snacks': 'Snacks',
    'coffee': 'Coffee',
    'non-coffee': 'Non-Coffee'
  }[categoryKey];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#6A4C2E' }}>
      {/* Header */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white hover:text-amber-200 mb-6"
          >
            <ArrowLeft className="mr-2" size={20} />
            Kembali ke Home
          </Button>
          <h1 className="text-5xl font-bold text-white text-center mb-2">{categoryTitle} Menu</h1>
          <p className="text-center text-amber-100 text-lg">Explore our delicious {categoryTitle.toLowerCase()} selection</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={item.id}>
                <div className="flex justify-between items-start py-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-2">{item.name}</h3>
                    <p className="text-amber-100 text-sm">{item.description}</p>
                  </div>
                  <div className="ml-6">
                    <span className="text-2xl font-bold text-white">{item.price / 1000}</span>
                  </div>
                </div>
                {index < items.length - 1 && (
                  <div className="border-b border-dotted border-amber-700"></div>
                )}
              </div>
            ))}
          </div>

          {/* View All Menu Button */}
          <div className="mt-12 text-center">
            <a
              href={menuDriveLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white px-8 py-6 text-lg"
                style={{ color: '#6A4C2E' }}
              >
                VIEW ALL MENU
                <ExternalLink className="ml-2" size={20} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailPage;
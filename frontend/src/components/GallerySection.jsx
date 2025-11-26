import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Dialog, DialogContent, DialogClose } from '../components/ui/dialog';

const GallerySection = () => {
  const [items, setItems] = useState([]);

  const fetchGallery = async () => {
    try {
      const res = await API.get('/api/gallery/');
      setItems(res.data);
    } catch (err) {
      console.error('Failed loading gallery', err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const [selected, setSelected] = useState(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs sm:text-sm uppercase tracking-wider font-semibold mb-2" style={{ color: '#8B6F47' }}>
            MOMENTS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-400 uppercase mb-2">Gallery</h2>
          <div className="w-16 h-1 mx-auto" style={{ backgroundColor: '#6A4C2E' }}></div>
        </div>

        {/* Gallery Grid - Smaller Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mt-8 sm:mt-12 md:mt-16">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer h-32 sm:h-36 md:h-40"
              onClick={() => setSelected(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelected(item); }}
            >
              {item.image_url ? (
                <img src={`http://localhost:8000${item.image_url}`} alt={item.title || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">No image</div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Dialog / Lightbox for preview */}
        <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
          {selected && (
            <DialogContent className="max-w-4xl w-full bg-transparent p-0 shadow-none">
              <div className="relative bg-black rounded flex items-center justify-center">
                <img src={`http://localhost:8000${selected.image_url}`} alt={selected.title || ''} className="w-full max-h-[80vh] object-contain mx-auto" />
                <div className="absolute right-3 top-3">
                  <DialogClose />
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
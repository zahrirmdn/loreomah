import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Upload, Trash2, Edit3 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import API from "../../api/api";

const SliderAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [sliders, setSliders] = useState([]);
  const [newSlider, setNewSlider] = useState({ title: "", description: "", image: null });
  const [loading, setLoading] = useState(false);

  const fetchSliders = async () => {
    try {
      const res = await API.get("/api/sliders/");
      setSliders(res.data);
    } catch (error) {
      console.error("Gagal memuat slider:", error);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleAddSlider = async () => {
    if (!newSlider.title || !newSlider.description || !newSlider.image) {
      toast({ title: "Lengkapi semua field", description: "Judul, deskripsi, dan gambar wajib diisi.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", newSlider.title);
    formData.append("description", newSlider.description);
    formData.append("image", newSlider.image);

    try {
      await API.post("/api/sliders/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Berhasil!", description: "Slider baru berhasil ditambahkan." });
      setNewSlider({ title: "", description: "", image: null });
      fetchSliders();
    } catch (error) {
      console.error("Gagal menambah slider:", error);
      toast({ title: "Gagal menambah slider", description: "Terjadi kesalahan saat upload.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlider = async (id) => {
    try {
      await API.delete(`/api/sliders/${id}`);
      toast({ title: "Slider dihapus", description: "Data slider berhasil dihapus." });
      fetchSliders();
    } catch (error) {
      toast({ title: "Gagal menghapus slider", description: "Terjadi kesalahan saat menghapus.", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Image className="mr-2" size={20} />
          <span className="text-sm sm:text-base">Kelola Hero Slider</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Tambah, hapus, dan ubah slider di homepage.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Judul Slider</label>
              <Input placeholder="Contoh: Selamat Datang di Cafe Loreomah" value={newSlider.title} onChange={(e) => setNewSlider({ ...newSlider, title: e.target.value })} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Deskripsi</label>
              <Textarea placeholder="Nikmati kopi terbaik dengan suasana nyaman" value={newSlider.description} onChange={(e) => setNewSlider({ ...newSlider, description: e.target.value })} className="text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Upload Gambar</label>
            <Input type="file" accept="image/*" onChange={(e) => setNewSlider({ ...newSlider, image: e.target.files[0] })} className="text-sm" />
          </div>

          <Button onClick={handleAddSlider} className="bg-amber-800 hover:bg-amber-900 text-sm" disabled={loading}>
            {loading ? "Menyimpan..." : (<><Upload className="mr-2" size={16} /> Tambah Slider</>)}
          </Button>

          <div className="mt-6 sm:mt-8">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Slider Saat Ini</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sliders.map((slide) => (
                <div key={slide.id} className="relative group border rounded-lg overflow-hidden shadow">
                  <img src={`http://localhost:8000${slide.image}`} alt={slide.title} className="w-full h-40 sm:h-48 object-cover" />
                  <div className="p-3 sm:p-4">
                    <h4 className="font-bold text-amber-900 text-sm sm:text-base">{slide.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{slide.description}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <Button size="sm" variant="secondary" className="h-7 w-7 sm:h-auto sm:w-auto p-1 sm:p-2" onClick={() => navigate(`/admin/edit-slider/${slide.id}`)}>
                      <Edit3 size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" className="h-7 w-7 sm:h-auto sm:w-auto p-1 sm:p-2" onClick={() => handleDeleteSlider(slide.id)}>
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SliderAdmin;

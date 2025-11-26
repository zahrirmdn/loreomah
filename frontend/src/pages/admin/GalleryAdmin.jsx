import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Trash2, Edit3, Upload } from "lucide-react";
import API from "../../api/api";
import { useToast } from "../../hooks/use-toast";

const GalleryAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [preview, setPreview] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await API.get("/api/gallery/");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!form.image && !form.title) {
      toast({ title: "Lengkapi field", description: "Tambahkan gambar atau judul.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const fd = new FormData();
    if (form.title) fd.append("title", form.title);
    if (form.description) fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    try {
      await API.post("/api/gallery/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Berhasil", description: "Gallery item ditambahkan." });
      setForm({ title: "", description: "", image: null });
      setPreview(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast({ title: "Gagal", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/gallery/${id}`);
      toast({ title: "Dihapus", description: "Gallery item berhasil dihapus." });
      fetchItems();
    } catch (err) {
      console.error(err);
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };



  const handleFileChange = (file) => {
    setForm({ ...form, image: file });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">Gallery Admin</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Kelola section Moments di landing page</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Judul</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul singkat (opsional)" className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Deskripsi</label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi (opsional)" className="text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Upload Gambar</label>
            <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} className="text-sm" />
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="preview" className="w-32 h-24 sm:w-40 sm:h-28 object-cover rounded" />
              </div>
            )}
          </div>

          <Button onClick={handleSubmit} className="bg-amber-800 hover:bg-amber-900 text-sm" disabled={loading}>
            {loading ? "Menyimpan..." : (<><Upload className="mr-2" size={16} /> Tambah Gallery</>)}
          </Button>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Gallery Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {items.map((it) => (
                <div key={it.id} className="relative group border rounded-lg overflow-hidden shadow">
                  {it.image_url ? <img src={`http://localhost:8000${it.image_url}`} alt={it.title || ""} className="w-full h-40 sm:h-48 object-cover" /> : <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center text-xs sm:text-sm">No image</div>}
                  <div className="p-3 sm:p-4">
                    <h4 className="font-bold text-amber-900 text-sm sm:text-base">{it.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{it.description}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <Button size="sm" variant="secondary" className="h-7 w-7 sm:h-auto sm:w-auto p-1 sm:p-2" onClick={() => navigate(`/admin/edit-gallery/${it.id}`)}><Edit3 size={14} className="sm:w-4 sm:h-4" /></Button>
                    <Button size="sm" variant="destructive" className="h-7 w-7 sm:h-auto sm:w-auto p-1 sm:p-2" onClick={() => handleDelete(it.id)}><Trash2 size={14} className="sm:w-4 sm:h-4" /></Button>
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

export default GalleryAdmin;

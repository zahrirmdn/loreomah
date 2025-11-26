import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import API from "../../api/api";
import { useToast } from "../../hooks/use-toast";

const EditMenuDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [category, setCategory] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", image: null, menu_link: "" });
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "" });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/api/menu-categories/`);
        const found = res.data.find((cat) => cat.name === name);
        setCategory(found);
        if (found) {
          setForm({ title: found.title, description: found.description, image: null, menu_link: found.menu_link || "" });
          // fetch menu items for this category
          try {
            const itemsRes = await API.get(`/api/menu-items/${name}/`);
            setItems(itemsRes.data || []);
          } catch (e) {
            console.warn("Gagal memuat menu items:", e);
            setItems([]);
          }
        }
      } catch (err) {
        console.error("Gagal fetch kategori:", err);
      }
    };
    fetchData();
  }, [name]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("name", category.name); // Required by backend
    formData.append("description", form.description);
    formData.append("menu_link", form.menu_link || "");
    if (form.image) formData.append("image", form.image);

    try {
      await API.put(`/api/menu-categories/${category.id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Berhasil", description: "Kategori menu berhasil diperbarui." });
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast({ title: "Gagal update", description: err.response?.data?.detail || "Terjadi kesalahan", variant: "destructive" });
    }
  };

  if (!category) return <div className="p-6">Memuat data...</div>;

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 md:p-6">
      <Button onClick={() => navigate(-1)} variant="ghost" className="mb-4 sm:mb-6 flex items-center text-sm">
        <ArrowLeft className="mr-2" size={16} /> Kembali
      </Button>

      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Edit Kategori: {category.title}</h1>

      <div className="space-y-3 sm:space-y-4">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul kategori" className="text-sm" />
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi kategori" className="text-sm" />
        <Input placeholder="Link 'View All Menu' (Google Drive atau URL lain)" value={form.menu_link} onChange={(e) => setForm({ ...form, menu_link: e.target.value })} className="text-sm" />
        <Input type="file" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="text-sm" />

        <Button onClick={handleSubmit} className="bg-amber-800 hover:bg-amber-900 text-sm">Simpan Perubahan</Button>

        {/* Menu Items Management */}
        <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Menu Items untuk {category.title}</h3>

          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            <Input placeholder="Nama item" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="text-sm" />
            <Input placeholder="Harga (angka)" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="text-sm" />
            <Textarea placeholder="Deskripsi item" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="text-sm" />
            <div className="flex space-x-2">
              <Button onClick={async () => {
                if (!newItem.name) return toast({ title: "Isi nama item", variant: "destructive" });
                try {
                  await API.post(`/api/menu-items/`, { ...newItem, category: name });
                  toast({ title: "Item ditambahkan" });
                  setNewItem({ name: "", description: "", price: "" });
                  const itemsRes = await API.get(`/api/menu-items/${name}/`);
                  setItems(itemsRes.data || []);
                } catch (e) {
                  console.error(e);
                  toast({ title: "Gagal menambah item", variant: "destructive" });
                }
              }} className="bg-amber-700 text-sm">Tambah Item</Button>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {items.map((it) => (
              <div key={it.id} className="p-2 sm:p-3 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{it.name} <span className="text-xs sm:text-sm text-gray-500">Rp {it.price?.toLocaleString?.() ?? it.price}</span></div>
                  <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">{it.description}</div>
                </div>
                <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                  <Button size="sm" variant="secondary" className="text-xs" onClick={() => {
                    setEditingItemId(it.id);
                    setEditingItemData({ name: it.name || "", description: it.description || "", price: it.price || "" });
                  }}>Edit</Button>
                  <Button size="sm" variant="destructive" className="text-xs" onClick={async () => {
                    if (!confirm("Hapus item ini?")) return;
                    try {
                      await API.delete(`/api/menu-items/${it.id}`);
                      toast({ title: "Item dihapus" });
                      const itemsRes = await API.get(`/api/menu-items/${name}/`);
                      setItems(itemsRes.data || []);
                    } catch (e) {
                      console.error(e);
                      toast({ title: "Gagal menghapus item", variant: "destructive" });
                    }
                  }}>Hapus</Button>
                </div>
              </div>
            ))}
          </div>

          {editingItemId && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 border rounded bg-white">
              <h4 className="font-semibold mb-2 text-sm">Edit Item</h4>
              <Input value={editingItemData.name} onChange={(e) => setEditingItemData({ ...editingItemData, name: e.target.value })} placeholder="Nama item" className="mb-2 text-sm" />
              <Input value={editingItemData.price} onChange={(e) => setEditingItemData({ ...editingItemData, price: e.target.value })} placeholder="Harga" className="mb-2 text-sm" />
              <Textarea value={editingItemData.description} onChange={(e) => setEditingItemData({ ...editingItemData, description: e.target.value })} placeholder="Deskripsi" className="mb-2 text-sm" />
              <div className="flex space-x-2 mt-2">
                <Button onClick={async () => {
                  try {
                    await API.put(`/api/menu-items/${editingItemId}`, editingItemData);
                    toast({ title: "Item diperbarui" });
                    setEditingItemId(null);
                    const itemsRes = await API.get(`/api/menu-items/${name}/`);
                    setItems(itemsRes.data || []);
                  } catch (e) {
                    console.error(e);
                    toast({ title: "Gagal update item", variant: "destructive" });
                  }
                }} className="text-sm">Simpan</Button>
                <Button variant="ghost" onClick={() => setEditingItemId(null)} className="text-sm">Batal</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMenuDetail;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, Edit3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger, AlertDialogDescription } from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import API from "../../api/api";

const MenuAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);
  const [categoryItems, setCategoryItems] = useState({}); // { slug: [items] }
  const [newCategory, setNewCategory] = useState({ title: "", name: "", description: "", image: null, menu_link: "" });
  const [newItemsForm, setNewItemsForm] = useState({}); // { slug: { name:'', price:'', description:'' } }
  const [editingItem, setEditingItem] = useState(null); // item object
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "" });
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'item'|'category', id, slug }
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/menu-categories/");
      setCategories(res.data);
      // Initialize per-category item form state
      const initForms = {};
      res.data.forEach(cat => {
        initForms[cat.name.toLowerCase()] = { name: "", price: "", description: "" };
      });
      setNewItemsForm(initForms);
      // Fetch items for each category
      const itemsMap = {};
      await Promise.all(res.data.map(async (cat) => {
        try {
          const itemsRes = await API.get(`/api/menu-items/${cat.name.toLowerCase()}/`);
          itemsMap[cat.name.toLowerCase()] = itemsRes.data || [];
        } catch (e) {
          itemsMap[cat.name.toLowerCase()] = [];
        }
      }));
      setCategoryItems(itemsMap);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.title || !newCategory.name || !newCategory.description || !newCategory.image) {
      toast({ title: "Lengkapi semua field", description: "Judul, slug, deskripsi, dan gambar wajib diisi.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", newCategory.title);
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    formData.append("image", newCategory.image);
    if (newCategory.menu_link) formData.append("menu_link", newCategory.menu_link);

    try {
      await API.post("/api/menu-categories/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Berhasil!", description: "Kategori baru berhasil ditambahkan." });
      setNewCategory({ title: "", name: "", description: "", image: null, menu_link: "" });
      fetchCategories();
    } catch (error) {
      console.error("Gagal menambah kategori:", error);
      toast({ title: "Gagal menambah kategori", description: "Terjadi kesalahan saat upload.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await API.delete(`/api/menu-categories/${id}`);
      toast({ title: "Kategori dihapus", description: "Kategori menu berhasil dihapus." });
      fetchCategories();
    } catch (error) {
      toast({ title: "Gagal menghapus kategori", description: "Terjadi kesalahan saat menghapus.", variant: "destructive" });
    }
  };

  const handleAddItem = async (slug) => {
    const form = newItemsForm[slug];
    if (!form.name) {
      toast({ title: "Nama item wajib", variant: "destructive" });
      return;
    }
    try {
      await API.post('/api/menu-items/', { ...form, category: slug });
      toast({ title: 'Item ditambahkan' });
      // refresh items for category
      const itemsRes = await API.get(`/api/menu-items/${slug}/`);
      setCategoryItems(prev => ({ ...prev, [slug]: itemsRes.data || [] }));
      setNewItemsForm(prev => ({ ...prev, [slug]: { name: "", price: "", description: "" } }));
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal menambah item', variant: 'destructive' });
    }
  };

  const handleDeleteItem = async (itemId, slug) => {
    try {
      await API.delete(`/api/menu-items/${itemId}`);
      toast({ title: 'Item dihapus' });
      const itemsRes = await API.get(`/api/menu-items/${slug}/`);
      setCategoryItems(prev => ({ ...prev, [slug]: itemsRes.data || [] }));
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal menghapus item', variant: 'destructive' });
    }
  };

  const handleUpdateItem = async (item, slug) => {
    try {
      await API.put(`/api/menu-items/${item.id}`, editForm);
      toast({ title: 'Item diperbarui' });
      const itemsRes = await API.get(`/api/menu-items/${slug}/`);
      setCategoryItems(prev => ({ ...prev, [slug]: itemsRes.data || [] }));
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal update item', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">
          <FileText className="mr-2" size={20} />
          <span className="text-sm sm:text-base">Kelola Kategori Menu</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Tambah, ubah, atau hapus kategori menu untuk halaman utama.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Judul Kategori</label>
              <Input placeholder="Contoh: Coffee" value={newCategory.title} onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Slug / Nama URL</label>
              <Input placeholder="Contoh: coffee" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Deskripsi</label>
            <Textarea placeholder="Deskripsi singkat kategori menu" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} className="text-sm" />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Link 'View All Menu' (opsional)</label>
            <Input placeholder="Contoh: https://drive.google.com/..." value={newCategory.menu_link} onChange={(e) => setNewCategory({ ...newCategory, menu_link: e.target.value })} className="text-sm" />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Upload Gambar</label>
            <Input type="file" accept="image/*" onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })} className="text-sm" />
          </div>

          <Button onClick={handleAddCategory} className="bg-amber-800 hover:bg-amber-900 text-sm" disabled={loading}>{loading ? "Menyimpan..." : "Tambah Kategori"}</Button>

          <div className="mt-6 sm:mt-8">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Kategori Menu Saat Ini</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((cat) => {
                const slug = cat.name.toLowerCase();
                const items = categoryItems[slug] || [];
                const addForm = newItemsForm[slug] || { name: '', price: '', description: '' };
                return (
                  <div key={cat.id} className="relative border rounded-lg overflow-hidden shadow flex flex-col">
                    <div className="relative h-32 sm:h-40 overflow-hidden">
                      <img src={`http://localhost:8000${cat.image_url}`} alt={cat.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex space-x-1 sm:space-x-2">
                        <Button size="sm" variant="secondary" className="h-7 w-7 sm:h-auto sm:w-auto p-1 sm:p-2" onClick={() => navigate(`/admin/edit-menu/${cat.name}`)}>
                          <Edit3 size={14} className="sm:w-4 sm:h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 w-7 sm:h-auto sm:w-auto p-1 sm:p-2" onClick={() => handleDeleteCategory(cat.id)}>
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <h4 className="font-bold text-amber-900 mb-1 text-sm sm:text-base">{cat.title}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-2 line-clamp-3">{cat.description}</p>
                      {cat.menu_link && (
                        <a href={cat.menu_link} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-blue-600 underline mb-2 sm:mb-3">View All Menu Link</a>
                      )}
                      <div className="mb-2 sm:mb-3">
                        <h5 className="text-xs sm:text-sm font-semibold mb-1">Items:</h5>
                        <div className="space-y-1 max-h-32 overflow-auto pr-1">
                          {items.map(it => (
                            <div key={it.id} className="flex justify-between items-start text-[10px] sm:text-xs bg-gray-50 p-1.5 sm:p-2 rounded">
                              <div className="flex-1 min-w-0 mr-1 sm:mr-2">
                                <div className="font-medium truncate">{it.name}</div>
                                <div className="text-gray-500">Rp {it.price?.toLocaleString?.('id-ID') ?? it.price}</div>
                                {it.description && <div className="text-gray-400 italic line-clamp-2">{it.description}</div>}
                              </div>
                              <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 sm:h-7 sm:w-7 p-0"
                                  onClick={() => {
                                    setEditingItem({ ...it, slug });
                                    setEditForm({ name: it.name || '', price: it.price || '', description: it.description || '' });
                                  }}
                                >
                                  <Edit3 size={12} className="sm:w-3.5 sm:h-3.5" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                      <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Hapus item?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tindakan ini akan menghapus item <strong>{it.name}</strong> secara permanen.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteItem(it.id, slug)}>Hapus</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                          {items.length === 0 && <div className="text-gray-400 italic text-[10px] sm:text-xs">Belum ada item</div>}
                        </div>
                      </div>
                      <div className="mt-auto">
                        <h5 className="text-xs sm:text-sm font-semibold mb-1">Tambah Item</h5>
                        <Input className="mb-1 text-xs sm:text-sm" placeholder="Nama" value={addForm.name} onChange={(e) => setNewItemsForm(prev => ({ ...prev, [slug]: { ...prev[slug], name: e.target.value } }))} />
                        <Input className="mb-1 text-xs sm:text-sm" placeholder="Harga" value={addForm.price} onChange={(e) => setNewItemsForm(prev => ({ ...prev, [slug]: { ...prev[slug], price: e.target.value } }))} />
                        <Textarea className="mb-2 text-xs sm:text-sm" placeholder="Deskripsi" value={addForm.description} onChange={(e) => setNewItemsForm(prev => ({ ...prev, [slug]: { ...prev[slug], description: e.target.value } }))} />
                        <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-xs sm:text-sm" onClick={() => handleAddItem(slug)}>Tambah</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    {/* Edit Item Dialog */}
    <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) setEditingItem(null); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Edit Item Menu</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 sm:space-y-3">
          <Input placeholder="Nama" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="text-sm" />
          <Input placeholder="Harga" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="text-sm" />
          <Textarea placeholder="Deskripsi" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="text-sm" />
        </div>
        <DialogFooter className="mt-3 sm:mt-4">
          <Button variant="ghost" className="text-sm" onClick={() => setEditingItem(null)}>Batal</Button>
          {editingItem && (
            <Button className="text-sm" onClick={() => handleUpdateItem(editingItem, editingItem.slug)}>Simpan</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default MenuAdmin;

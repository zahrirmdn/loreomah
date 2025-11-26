import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import API from "../../api/api";

const EditGallery = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [gallery, setGallery] = useState({ title: "", description: "", image: "" });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchGallery = async () => {
      setFetchLoading(true);
      try {
        const res = await API.get(`/api/gallery/${id}`);
        const data = res.data;
        setGallery({
          title: data.title || "",
          description: data.description || "",
          image: data.image || data.image_url || ""
        });
        const imgPath = data.image || data.image_url;
        setImagePreview(imgPath ? `${API_BASE}${imgPath}` : "");
      } catch (error) {
        console.error("Gagal memuat gallery:", error);
        const errorMsg = error.response?.data?.detail || error.message || "Gagal memuat data gallery";
        toast({ title: "Error", description: errorMsg, variant: "destructive" });
        setTimeout(() => navigate("/admin/dashboard"), 2000);
      } finally {
        setFetchLoading(false);
      }
    };
    if (id) {
      fetchGallery();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!gallery.title) {
      toast({ title: "Error", description: "Judul wajib diisi.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", gallery.title);
    if (gallery.description) {
      formData.append("description", gallery.description);
    }
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await API.put(`/api/gallery/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Berhasil!", description: "Gallery berhasil diperbarui." });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Gagal update gallery:", error);
      toast({ title: "Gagal", description: "Terjadi kesalahan saat menyimpan perubahan.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <Button
          onClick={() => navigate("/admin/dashboard")}
          variant="ghost"
          className="mb-3 sm:mb-4 text-sm"
        >
          <ArrowLeft className="mr-2" size={16} />
          <span className="hidden sm:inline">Kembali ke Dashboard</span>
          <span className="sm:hidden">Kembali</span>
        </Button>

        {fetchLoading ? (
          <Card>
            <CardContent className="py-8 sm:py-12">
              <p className="text-center text-gray-500 text-sm">Memuat data gallery...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Edit Gallery</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Perbarui informasi gallery item</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Judul</label>
                  <Input
                    placeholder="Contoh: Interior Cafe"
                    value={gallery.title}
                    onChange={(e) => setGallery({ ...gallery, title: e.target.value })}
                    className="text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Deskripsi (Opsional)</label>
                  <Textarea
                    placeholder="Deskripsi gambar"
                    value={gallery.description}
                    onChange={(e) => setGallery({ ...gallery, description: e.target.value })}
                    rows={4}
                    className="text-sm"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Preview Gambar</label>
                    <div className="border rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 sm:h-56 md:h-64 object-cover" />
                    </div>
                  </div>
                )}

                {/* Upload New Image */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    {newImage ? "Ganti Gambar Baru" : "Upload Gambar Baru (Opsional)"}
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah gambar</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-amber-800 hover:bg-amber-900 text-sm"
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : (
                      <>
                        <Save className="mr-2" size={16} />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/dashboard")}
                    variant="outline"
                    className="text-sm"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EditGallery;

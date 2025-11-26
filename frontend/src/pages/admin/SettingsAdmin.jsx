import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Settings, Save, Phone, MapPin, Instagram, Facebook, Mail } from "lucide-react";
import API from "../../api/api";
import { useToast } from "../../hooks/use-toast";

const SettingsAdmin = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    contact: {
      instagram: "",
      facebook: "",
      email: "",
      tiktok: "",
      youtube: "",
      phone: "",
      address: "",
      maps: "",
      weekdays: "",
      weekend: ""
    },
    about: {
      title: "",
      subtitle: "",
      mission: "",
      vision: "",
      values: [
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" }
      ]
    },
    story: {
      title: "",
      paragraphs: ["", "", ""],
      image: ""
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get("/api/settings/");
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to load settings:", err);
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan",
        variant: "destructive"
      });
    }
  };

  const handleContactChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleAboutChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      about: { ...prev.about, [field]: value }
    }));
  };

  const handleValueChange = (index, field, value) => {
    setSettings(prev => {
      const newValues = [...prev.about.values];
      newValues[index] = { ...newValues[index], [field]: value };
      return {
        ...prev,
        about: { ...prev.about, values: newValues }
      };
    });
  };

  const handleStoryChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      story: { ...prev.story, [field]: value }
    }));
  };

  const handleParagraphChange = (index, value) => {
    setSettings(prev => {
      const newParagraphs = [...prev.story.paragraphs];
      newParagraphs[index] = value;
      return {
        ...prev,
        story: { ...prev.story, paragraphs: newParagraphs }
      };
    });
  };

  const saveSettings = async (section) => {
    setLoading(true);
    try {
      let endpoint = "/api/settings/";
      let payload = settings;
      
      if (section === "contact") {
        endpoint = "/api/settings/contact";
        payload = settings.contact;
      } else if (section === "about") {
        endpoint = "/api/settings/about";
        payload = settings.about;
      } else if (section === "story") {
        endpoint = "/api/settings/story";
        payload = settings.story;
      }

      await API.put(endpoint, payload);
      toast({
        title: "Berhasil",
        description: `Pengaturan ${section} berhasil disimpan`
      });
      fetchSettings();
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Settings className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: "#6A4C2E" }} />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Pengaturan Situs</h1>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="contact">Kontak</TabsTrigger>
          <TabsTrigger value="about">Tentang</TabsTrigger>
          <TabsTrigger value="story">Cerita</TabsTrigger>
        </TabsList>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Phone size={20} />
              Informasi Kontak
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Instagram</label>
                <Input
                  value={settings.contact.instagram}
                  onChange={(e) => handleContactChange("instagram", e.target.value)}
                  placeholder="@cafeloreomah"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Facebook</label>
                <Input
                  value={settings.contact.facebook}
                  onChange={(e) => handleContactChange("facebook", e.target.value)}
                  placeholder="Cafe Loreomah Official"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  placeholder="hello@cafeloreomah.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">TikTok</label>
                <Input
                  value={settings.contact.tiktok}
                  onChange={(e) => handleContactChange("tiktok", e.target.value)}
                  placeholder="cafeloreomah"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">YouTube</label>
                <Input
                  value={settings.contact.youtube}
                  onChange={(e) => handleContactChange("youtube", e.target.value)}
                  placeholder="Cafe Loreomah"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telepon</label>
                <Input
                  value={settings.contact.phone}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                  placeholder="0821-4243-3998"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Alamat</label>
                <Textarea
                  value={settings.contact.address}
                  onChange={(e) => handleContactChange("address", e.target.value)}
                  placeholder="Alamat lengkap cafe"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Google Maps Link</label>
                <Input
                  value={settings.contact.maps}
                  onChange={(e) => handleContactChange("maps", e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Jam Buka (Senin-Jumat)</label>
                <Input
                  value={settings.contact.weekdays}
                  onChange={(e) => handleContactChange("weekdays", e.target.value)}
                  placeholder="09.00 - 19.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Jam Buka (Weekend)</label>
                <Input
                  value={settings.contact.weekend}
                  onChange={(e) => handleContactChange("weekend", e.target.value)}
                  placeholder="09.00 - 20.00"
                />
              </div>
            </div>
            <Button
              onClick={() => saveSettings("contact")}
              disabled={loading}
              className="mt-6 bg-[#6A4C2E] hover:bg-[#8B6F47]"
            >
              <Save className="mr-2" size={18} />
              Simpan Kontak
            </Button>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Tentang Kami</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Judul Halaman</label>
                <Input
                  value={settings.about.title}
                  onChange={(e) => handleAboutChange("title", e.target.value)}
                  placeholder="Tentang Kami"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subtitle</label>
                <Input
                  value={settings.about.subtitle}
                  onChange={(e) => handleAboutChange("subtitle", e.target.value)}
                  placeholder="Tagline atau deskripsi singkat"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Misi</label>
                <Textarea
                  value={settings.about.mission}
                  onChange={(e) => handleAboutChange("mission", e.target.value)}
                  placeholder="Pernyataan misi"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Visi</label>
                <Textarea
                  value={settings.about.vision}
                  onChange={(e) => handleAboutChange("vision", e.target.value)}
                  placeholder="Pernyataan visi"
                  rows={3}
                />
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Nilai-Nilai</h3>
              {settings.about.values.map((val, idx) => (
                <Card key={idx} className="p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Judul Nilai {idx + 1}</label>
                      <Input
                        value={val.title}
                        onChange={(e) => handleValueChange(idx, "title", e.target.value)}
                        placeholder={`Nilai ${idx + 1}`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Deskripsi Nilai {idx + 1}</label>
                      <Textarea
                        value={val.description}
                        onChange={(e) => handleValueChange(idx, "description", e.target.value)}
                        placeholder={`Deskripsi nilai ${idx + 1}`}
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button
              onClick={() => saveSettings("about")}
              disabled={loading}
              className="mt-6 bg-[#6A4C2E] hover:bg-[#8B6F47]"
            >
              <Save className="mr-2" size={18} />
              Simpan Tentang
            </Button>
          </Card>
        </TabsContent>

        {/* Story Tab */}
        <TabsContent value="story">
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Cerita Kami</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Judul Cerita</label>
                <Input
                  value={settings.story.title}
                  onChange={(e) => handleStoryChange("title", e.target.value)}
                  placeholder="CERITA KAMI"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL Gambar</label>
                <Input
                  value={settings.story.image}
                  onChange={(e) => handleStoryChange("image", e.target.value)}
                  placeholder="http://localhost:8000/uploads/sliders/..."
                />
                {settings.story.image && (
                  <img src={settings.story.image} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded border" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Paragraf Cerita</h3>
              {settings.story.paragraphs.map((para, idx) => (
                <div key={idx}>
                  <label className="text-sm font-medium mb-1 block">Paragraf {idx + 1}</label>
                  <Textarea
                    value={para}
                    onChange={(e) => handleParagraphChange(idx, e.target.value)}
                    placeholder={`Paragraf ${idx + 1}`}
                    rows={4}
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={() => saveSettings("story")}
              disabled={loading}
              className="mt-6 bg-[#6A4C2E] hover:bg-[#8B6F47]"
            >
              <Save className="mr-2" size={18} />
              Simpan Cerita
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsAdmin;

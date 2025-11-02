import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Image, Menu, FileText, Users as UsersIcon, Calendar, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logout Berhasil",
      description: "Sampai jumpa!"
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white shadow-lg" style={{ backgroundColor: '#6A4C2E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="font-bold" style={{ color: '#6A4C2E' }}>CL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-amber-200">Cafe Loreomah</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-white hover:text-amber-200"
              >
                <Home className="mr-2" size={20} />
                Ke Website
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:text-amber-200"
              >
                <LogOut className="mr-2" size={20} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="slider">Slider</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="bookings">Reservasi</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 text-amber-600" size={24} />
                    Reservasi Hari Ini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-amber-900">12</p>
                  <p className="text-sm text-gray-500 mt-2">Total reservasi aktif</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Menu className="mr-2 text-amber-600" size={24} />
                    Total Menu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-amber-900">48</p>
                  <p className="text-sm text-gray-500 mt-2">Item menu tersedia</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UsersIcon className="mr-2 text-amber-600" size={24} />
                    User Terdaftar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-amber-900">156</p>
                  <p className="text-sm text-gray-500 mt-2">Total pengguna</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Selamat Datang, Admin!</CardTitle>
                <CardDescription>
                  Kelola konten website Cafe Loreomah dengan mudah melalui dashboard ini.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Anda dapat mengedit slider, menu, gallery, dan melihat daftar reservasi dari pelanggan. 
                  Gunakan tab di atas untuk navigasi ke section yang ingin Anda kelola.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Slider Management */}
          <TabsContent value="slider">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2" size={24} />
                  Kelola Hero Slider
                </CardTitle>
                <CardDescription>
                  Edit gambar, judul, dan deskripsi pada slider homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Slide 1
                    </label>
                    <Input defaultValue="Selamat Datang di Cafe Loreomah" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Slide 1
                    </label>
                    <Textarea defaultValue="Nikmati kopi specialty terbaik Indonesia dengan suasana hangat dan nyaman" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Gambar Baru
                    </label>
                    <Input type="file" accept="image/*" />
                  </div>
                  <Button className="bg-amber-800 hover:bg-amber-900">
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Management */}
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Menu className="mr-2" size={24} />
                  Kelola Menu
                </CardTitle>
                <CardDescription>
                  Tambah, edit, atau hapus item menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Menu
                      </label>
                      <Input placeholder="Contoh: Cappuccino" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga
                      </label>
                      <Input type="number" placeholder="25000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option>Food</option>
                      <option>Snacks</option>
                      <option>Coffee</option>
                      <option>Non-Coffee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Gambar
                    </label>
                    <Input type="file" accept="image/*" />
                  </div>
                  <Button className="bg-amber-800 hover:bg-amber-900">
                    Tambah Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Management */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2" size={24} />
                  Kelola Gallery
                </CardTitle>
                <CardDescription>
                  Upload dan kelola foto-foto cafe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Foto Gallery
                    </label>
                    <Input type="file" accept="image/*" multiple />
                    <p className="text-sm text-gray-500 mt-2">
                      Anda dapat upload multiple files sekaligus
                    </p>
                  </div>
                  <Button className="bg-amber-800 hover:bg-amber-900">
                    Upload Foto
                  </Button>

                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-800 mb-4">Foto yang sudah ada</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative group">
                          <img
                            src={`https://images.unsplash.com/photo-149545747230${i}?w=200`}
                            alt="Gallery"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Hapus
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" size={24} />
                  Daftar Reservasi
                </CardTitle>
                <CardDescription>
                  Lihat dan kelola reservasi pelanggan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telepon</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jumlah Orang</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { name: 'Budi Santoso', phone: '081234567890', guests: 4, date: '2025-01-20', status: 'Confirmed' },
                        { name: 'Siti Aminah', phone: '081298765432', guests: 2, date: '2025-01-20', status: 'Pending' },
                        { name: 'Ahmad Rifai', phone: '081345678901', guests: 6, date: '2025-01-21', status: 'Confirmed' },
                      ].map((booking, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{booking.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{booking.phone}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{booking.guests}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{booking.date}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

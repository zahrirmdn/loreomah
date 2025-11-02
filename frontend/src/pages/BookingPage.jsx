import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Phone, User, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';

const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState();
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    guests: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Error",
        description: "Silakan pilih tanggal reservasi",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reservasi Berhasil!",
      description: `Reservasi untuk ${bookingData.guests} orang pada ${format(date, 'dd MMMM yyyy')} telah dikonfirmasi.`
    });

    // Reset form
    setBookingData({ name: '', phone: '', guests: '' });
    setDate(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white py-12" style={{ background: 'linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white hover:text-amber-200 mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Kembali
          </Button>
          <h1 className="text-4xl font-bold mb-2">Reservasi Tempat</h1>
          <p className="text-xl text-amber-100">Pesan tempat Anda di Cafe Loreomah</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Reservasi</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    placeholder="Masukkan nama Anda"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    placeholder="08xx xxxx xxxx"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Orang *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                    placeholder="Berapa orang?"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Reservasi *
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2" size={20} />
                      {date ? format(date, 'dd MMMM yyyy') : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-6 text-lg"
              >
                Konfirmasi Reservasi
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Catatan:</strong> Reservasi akan dikonfirmasi melalui telepon oleh tim kami. 
                Mohon pastikan nomor telepon yang Anda berikan aktif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
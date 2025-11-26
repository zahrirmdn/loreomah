import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Phone, User, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Input } from '../components/ui/input';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import API from '../api/api';

const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState();
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    guests: '',
    time: ''
  });
  const [myReservations, setMyReservations] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasUnconfirmedReservation, setHasUnconfirmedReservation] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [confirmSubmitDialog, setConfirmSubmitDialog] = useState(false);

  const statusColor = (status) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'cancelled') return 'bg-red-100 text-red-700 border-red-200';
    if (status === 'declined') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await API.put('/api/reservations/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Trigger badge update
      window.dispatchEvent(new Event('reservationUpdated'));
    } catch (error) {
      console.error('Error marking reservations as read:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoadingList(true);
    
    // Mark all reservations as read when user opens this page
    markAllAsRead();
    
    API.get('/api/reservations/mine?page=1&size=10', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const items = res.data.items || [];
        setMyReservations(items);
        // User can book only if all active reservations are confirmed (or cancelled)
        // Block if there's any pending or declined reservation
        const hasUnconfirmed = items.some(r => r.status === 'pending' || r.status === 'declined');
        setHasUnconfirmedReservation(hasUnconfirmed);
        // Only show modal on initial page load, not after refresh
        if (hasUnconfirmed && isInitialLoad) {
          setShowActiveModal(true);
        }
        setIsInitialLoad(false);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingList(false));
  }, [refreshKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasUnconfirmedReservation) {
      toast({ 
        title: 'Tidak dapat membuat reservasi', 
        description: 'Anda memiliki reservasi yang belum di-konfirmasi. Harap tunggu konfirmasi admin atau batalkan reservasi tersebut.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Error",
        description: "Silakan pilih tanggal reservasi",
        variant: "destructive"
      });
      return;
    }

    if (!bookingData.time) {
      toast({
        title: "Error",
        description: "Silakan pilih jam reservasi",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation dialog
    setConfirmSubmitDialog(true);
  };

  const confirmSubmit = () => {

    // Combine date and time
    const [hours, minutes] = bookingData.time.split(':');
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Send to backend
    const token = localStorage.getItem('token');
    API.post('/api/reservations/', {
      name: bookingData.name,
      phone: bookingData.phone,
      guests: Number(bookingData.guests),
      date: dateWithTime.toISOString()
    }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    })
      .then((res) => {
        toast({
          title: "Reservasi Berhasil!",
          description: `Reservasi untuk ${bookingData.guests} orang pada ${format(date, 'dd MMMM yyyy')} telah dikonfirmasi.`
        });
        // Reset form
        setBookingData({ name: '', phone: '', guests: '', time: '' });
        setDate(undefined);
        setRefreshKey(k => k + 1); // refresh list
        // Trigger event for admin dashboard to update badge
        window.dispatchEvent(new Event('reservationUpdated'));
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Gagal membuat reservasi",
          description: err?.response?.data?.detail || 'Terjadi kesalahan. Coba lagi.',
          variant: "destructive"
        });
      })
      .finally(() => {
        setConfirmSubmitDialog(false);
      });
  };

  const cancelReservation = (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    API.put(`/api/reservations/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast({ title: 'Reservasi dibatalkan' });
        setRefreshKey(k => k + 1);
        setCancelDialogOpen(false);
        setReservationToCancel(null);
      })
      .catch(err => {
        console.error(err);
        toast({ title: 'Gagal membatalkan', variant: 'destructive' });
      });
  };

  const handleCancelClick = (reservation) => {
    setReservationToCancel(reservation);
    setCancelDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white py-8 sm:py-12" style={{ background: 'linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white hover:text-amber-200 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2" size={18} />
            Kembali
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Reservasi Tempat</h1>
          <p className="text-base sm:text-lg md:text-xl text-amber-100">Pesan tempat Anda di Cafe Loreomah</p>
        </div>
      </div>

      {!hasUnconfirmedReservation && (
        <div className="py-6 sm:py-8 md:py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Form Reservasi</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon *</label>
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
                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Orang *</label>
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
                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jam Reservasi *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, time })}
                        className={`px-2 sm:px-3 md:px-4 py-2 rounded-md border-2 font-medium transition-all text-sm sm:text-base ${
                          bookingData.time === time
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Reservasi *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2" size={20} />
                        {date ? format(date, 'dd MMMM yyyy') : 'Pilih tanggal'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="submit"
                  className="w-full text-white py-6 text-lg"
                  style={{ backgroundColor: '#6A4C2E' }}
                  disabled={hasUnconfirmedReservation}
                >
                  Konfirmasi Reservasi
                </Button>
              </form>
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Catatan:</strong> Reservasi akan dikonfirmasi melalui telepon oleh tim kami. Mohon pastikan nomor telepon yang Anda berikan aktif.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Dialog open={showActiveModal} onOpenChange={setShowActiveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg" style={{color:'#6A4C2E'}}>Reservasi Belum Dikonfirmasi</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Anda memiliki reservasi yang masih menunggu konfirmasi atau ditolak. Anda bisa membuat reservasi baru setelah reservasi tersebut dikonfirmasi oleh admin atau Anda batalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-gray-600">Gunakan tombol di bawah untuk melihat daftar reservasi atau menutup pemberitahuan ini.</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 text-white"
              style={{background:'#6A4C2E'}}
              onClick={() => {
                setShowActiveModal(false);
                // Scroll ke daftar reservasi
                const list = document.querySelector('[data-reservasi-list]');
                if (list) list.scrollIntoView({behavior:'smooth'});
              }}
            >
              Lihat Reservasi Saya
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowActiveModal(false)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Reservations */}
      <div className="pb-8 sm:pb-12 md:pb-16" data-reservasi-list>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{color:'#6A4C2E'}}>Reservasi Saya</h2>
            {loadingList ? (
              <p className="text-sm text-gray-500">Memuat daftar reservasi...</p>
            ) : myReservations.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada reservasi yang tercatat.</p>
            ) : (
              <div className="space-y-3">
                {myReservations.map(r => (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-md border">
                    <div className="space-y-1">
                      <p className="font-medium">{r.name} • {r.guests} orang</p>
                      <p className="text-xs text-gray-500">Tanggal: {r.date ? new Date(r.date).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}) : '-'}</p>
                      <p className="text-xs text-gray-500">Jam: {r.date ? new Date(r.date).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) : '-'}</p>
                      <p className="text-xs text-gray-400">Dibuat: {r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '-'}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${statusColor(r.status)}`}>
                        {r.status === 'pending' ? 'Menunggu' : r.status === 'confirmed' ? 'Dikonfirmasi' : r.status === 'declined' ? 'Ditolak' : r.status === 'cancelled' ? 'Dibatalkan' : r.status}
                      </span>
                      {(r.status === 'pending' || r.status === 'declined') && (
                        <Button variant="outline" size="sm" onClick={() => handleCancelClick(r)}>Batalkan</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembatalan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan reservasi ini?
              {reservationToCancel && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                  <p><strong>Nama:</strong> {reservationToCancel.name}</p>
                  <p><strong>Tanggal:</strong> {reservationToCancel.date ? new Date(reservationToCancel.date).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}) : '-'}</p>
                  <p><strong>Jam:</strong> {reservationToCancel.date ? new Date(reservationToCancel.date).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) : '-'}</p>
                  <p><strong>Jumlah Orang:</strong> {reservationToCancel.guests} orang</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => reservationToCancel && cancelReservation(reservationToCancel.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Batalkan Reservasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={confirmSubmitDialog} onOpenChange={setConfirmSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Reservasi</AlertDialogTitle>
            <AlertDialogDescription>
              Mohon periksa kembali detail reservasi Anda sebelum melanjutkan:
              <div className="mt-4 p-4 bg-amber-50 rounded-md text-sm space-y-2">
                <p><strong>Nama:</strong> {bookingData.name}</p>
                <p><strong>Telepon:</strong> {bookingData.phone}</p>
                <p><strong>Jumlah Orang:</strong> {bookingData.guests} orang</p>
                <p><strong>Tanggal:</strong> {date ? format(date, 'dd MMMM yyyy') : '-'}</p>
                <p><strong>Jam:</strong> {bookingData.time}</p>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Reservasi Anda akan menunggu konfirmasi dari admin.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Periksa Lagi</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSubmit}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Ya, Konfirmasi Reservasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingPage;
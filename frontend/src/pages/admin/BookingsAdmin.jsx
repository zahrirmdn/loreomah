import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { format } from "date-fns";

const BookingsAdmin = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', reservation: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState({ open: false, message: '' });

  const markAllAsReadByAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    API.put('/api/reservations/admin/mark-all-read', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch((err) => console.error('Error marking as read by admin:', err));
  };

  const fetchReservations = () => {
    setLoading(true);
    // admin existing endpoint returns all; we can locally filter & paginate for now
    API.get("/api/reservations/")
      .then((res) => {
        let data = res.data || [];
        if (statusFilter) data = data.filter(d => d.status === statusFilter);
        data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        setTotal(data.length);
        setReservations(data.slice((page-1)*size, page*size));
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Gagal memuat reservasi", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Don't mark as read automatically - let the badge persist until refresh
    fetchReservations();
  }, [page, statusFilter]);

  const updateStatus = (id, newStatus) => {
    console.log('updateStatus called, setting actionLoading to true');
    setActionLoading(true);
    
    // Show loading dialog for confirmed status
    if (newStatus === 'confirmed') {
      setLoadingDialog({ open: true, message: 'Mengirimkan email ke Customer...' });
    } else if (newStatus === 'declined') {
      setLoadingDialog({ open: true, message: 'Memproses penolakan reservasi...' });
    }
    
    // Close confirmation dialog
    setConfirmDialog({ open: false, type: '', reservation: null });
    
    const token = localStorage.getItem('token');
    let endpoint = `/api/reservations/${id}`;
    let body = { status: newStatus };
    
    // Use specific endpoints for confirm/decline
    if (newStatus === 'confirmed') {
      endpoint = `/api/reservations/${id}/confirm`;
      body = {};
    } else if (newStatus === 'declined') {
      endpoint = `/api/reservations/${id}/decline`;
      body = {};
    }
    
    console.log('Sending request to:', endpoint);
    API.put(endpoint, body, { headers: { Authorization: token ? `Bearer ${token}` : undefined } })
      .then(() => {
        console.log('Request successful');
        toast({ title: "Status diperbarui" });
        fetchReservations();
        // Trigger event for admin dashboard to update badge
        window.dispatchEvent(new Event('reservationUpdated'));
      })
      .catch((err) => {
        console.error('Request failed:', err);
        toast({ title: "Gagal memperbarui", variant: "destructive" });
      })
      .finally(() => {
        console.log('Setting actionLoading to false');
        setActionLoading(false);
        setLoadingDialog({ open: false, message: '' });
      });
  };

  const removeReservation = (id) => {
    setActionLoading(true);
    setLoadingDialog({ open: true, message: 'Menghapus reservasi...' });
    setConfirmDialog({ open: false, type: '', reservation: null });
    
    API.delete(`/api/reservations/${id}`)
      .then(() => {
        toast({ title: "Reservasi dihapus" });
        fetchReservations();
        // Trigger event for admin dashboard to update badge
        window.dispatchEvent(new Event('reservationUpdated'));
      })
      .catch((err) => {
        console.error(err);
        toast({ title: "Gagal menghapus", variant: "destructive" });
      })
      .finally(() => {
        setActionLoading(false);
        setLoadingDialog({ open: false, message: '' });
      });
  };

  const handleConfirm = () => {
    if (!confirmDialog.reservation) return;
    
    console.log('handleConfirm called, setting actionLoading to true');
    
    if (confirmDialog.type === 'delete') {
      removeReservation(confirmDialog.reservation.id);
    } else {
      updateStatus(confirmDialog.reservation.id, confirmDialog.type);
    }
  };

  const openConfirmDialog = (type, reservation) => {
    setConfirmDialog({ open: true, type, reservation });
  };

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Reservasi</h2>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
        <select
          value={statusFilter}
          onChange={(e)=>{ setStatusFilter(e.target.value); setPage(1); }}
          className="border rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
        >
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="declined">Declined</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="text-xs text-gray-500">Halaman {page} / {Math.ceil(total/size) || 1}</span>
        <div className="sm:ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="text-xs" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</Button>
          <Button variant="outline" size="sm" className="text-xs" disabled={page>=Math.ceil(total/size)} onClick={()=>setPage(p=>Math.min(Math.ceil(total/size),p+1))}>Next</Button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-2 sm:p-4">
        {loading ? (
          <p className="text-xs sm:text-sm">Memuat...</p>
        ) : reservations.length === 0 ? (
          <p className="text-xs sm:text-sm text-gray-600">Belum ada reservasi.</p>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="text-left">
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">Nama</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">Telepon</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">Orang</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">Tanggal</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">Jam</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">Status</th>
                  <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className={`border-t ${!r.is_read_by_admin ? 'bg-blue-50' : ''}`}>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm">{r.name}</span>
                        {!r.is_read_by_admin && (
                          <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                            Baru
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top text-xs sm:text-sm">{r.phone}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top text-xs sm:text-sm">{r.guests}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top text-xs sm:text-sm whitespace-nowrap">{r.date ? format(new Date(r.date), 'dd MMM yyyy') : '-'}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top text-xs sm:text-sm">{r.date ? format(new Date(r.date), 'HH:mm') : '-'}</td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top">
                      <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border whitespace-nowrap ${
                        r.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                        r.status === 'declined' ? 'bg-red-100 text-red-700 border-red-200' :
                        r.status === 'cancelled' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {r.status === 'pending' ? 'Menunggu' : 
                         r.status === 'confirmed' ? 'Dikonfirmasi' : 
                         r.status === 'declined' ? 'Ditolak' : 
                         r.status === 'cancelled' ? 'Dibatalkan' : r.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 py-1.5 sm:py-2 align-top">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <Button size="sm" className="text-[10px] sm:text-xs px-2 py-1 h-auto" onClick={() => openConfirmDialog('confirmed', r)} disabled={r.status==='confirmed'}>Terima</Button>
                        <Button size="sm" variant="outline" className="text-[10px] sm:text-xs px-2 py-1 h-auto" onClick={() => openConfirmDialog('declined', r)} disabled={r.status==='declined'||r.status==='cancelled'}>Tolak</Button>
                        <Button size="sm" variant="destructive" className="text-[10px] sm:text-xs px-2 py-1 h-auto" onClick={() => openConfirmDialog('delete', r)}>Hapus</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => {
        if (!open && !actionLoading) {
          setConfirmDialog({ open: false, type: '', reservation: null });
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === 'confirmed' && 'Konfirmasi Terima Reservasi'}
              {confirmDialog.type === 'declined' && 'Konfirmasi Tolak Reservasi'}
              {confirmDialog.type === 'delete' && 'Konfirmasi Hapus Reservasi'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === 'confirmed' && 'Apakah Anda yakin ingin menerima reservasi ini?'}
              {confirmDialog.type === 'declined' && 'Apakah Anda yakin ingin menolak reservasi ini?'}
              {confirmDialog.type === 'delete' && 'Apakah Anda yakin ingin menghapus reservasi ini secara permanen?'}
              
              {confirmDialog.reservation && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm space-y-1">
                  <p><strong>Nama:</strong> {confirmDialog.reservation.name}</p>
                  <p><strong>Telepon:</strong> {confirmDialog.reservation.phone}</p>
                  <p><strong>Jumlah Orang:</strong> {confirmDialog.reservation.guests}</p>
                  <p><strong>Tanggal:</strong> {confirmDialog.reservation.date ? format(new Date(confirmDialog.reservation.date), 'dd MMM yyyy') : '-'}</p>
                  <p><strong>Jam:</strong> {confirmDialog.reservation.date ? format(new Date(confirmDialog.reservation.date), 'HH:mm') : '-'}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              disabled={actionLoading}
              className={confirmDialog.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {actionLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {confirmDialog.type === 'confirmed' && 'Mengirim Email...'}
                  {confirmDialog.type === 'declined' && 'Memproses...'}
                  {confirmDialog.type === 'delete' && 'Menghapus...'}
                </span>
              ) : (
                <>
                  {confirmDialog.type === 'confirmed' && 'Ya, Terima'}
                  {confirmDialog.type === 'declined' && 'Ya, Tolak'}
                  {confirmDialog.type === 'delete' && 'Ya, Hapus'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Dialog */}
      <AlertDialog open={loadingDialog.open}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              📧 Memproses Reservasi
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base pt-6 pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 font-semibold">
                  {loadingDialog.message}
                </p>
                <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingsAdmin;

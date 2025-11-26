import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { CalendarHeart } from "lucide-react";

const ReservationPromoModal = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleReserve = () => {
    onOpenChange(false);
    navigate("/booking");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="px-6 pt-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <CalendarHeart className="text-amber-600" /> Promo Reservasi!
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                Nikmati suasana hangat Cafe Loreomah. Pesan tempatmu sekarang
                dan pastikan mendapatkan meja terbaik untuk keluarga atau teman.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 mt-4">
            <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                Reservasi memudahkan kami menyiapkan pelayanan terbaik. Klik tombol di bawah untuk lanjut ke form.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleReserve}
              className="flex-1 text-white"
              style={{ backgroundColor: "#6A4C2E" }}
            >
              Reservasi Sekarang
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Nanti Saja
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationPromoModal;

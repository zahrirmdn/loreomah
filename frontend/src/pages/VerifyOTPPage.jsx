import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../components/ui/alert-dialog";
import API from "../api/api";
import LogoImg from '../assets/logo_loreomah.png';
import { Mail, RefreshCw } from "lucide-react";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    // Get email from navigation state
    const registeredEmail = location.state?.email;
    if (!registeredEmail) {
      toast({
        title: "Error",
        description: "Email tidak ditemukan. Silakan daftar kembali.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setEmail(registeredEmail);
  }, [location, navigate, toast]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast({
        title: "Error",
        description: "Kode OTP harus 6 digit",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/verify-otp", {
        email: email,
        otp_code: otpCode
      });

      // Show success dialog
      setShowSuccessDialog(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast({
        title: "Verifikasi Gagal",
        description: error.response?.data?.detail || "Kode OTP salah atau sudah kadaluarsa.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResending(true);
    try {
      await API.post("/auth/resend-otp", { email: email });
      
      toast({
        title: "OTP Terkirim!",
        description: "Kode OTP baru telah dikirim ke email Anda.",
      });
      
      setCountdown(60); // 60 seconds cooldown
      setOtpCode(""); // Clear input
    } catch (error) {
      toast({
        title: "Gagal Mengirim OTP",
        description: error.response?.data?.detail || "Terjadi kesalahan, silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4"
      style={{
        background: "linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%)",
      }}
    >
      <div className="max-w-md w-full">
        {/* HEADER */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-3 sm:mb-4 overflow-hidden">
            <img src={LogoImg} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Verifikasi Email</h1>
          <p className="text-amber-200 mt-2 text-sm sm:text-base">Masukkan kode OTP yang dikirim ke email Anda</p>
        </div>

        {/* VERIFY FORM */}
        <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
          <form onSubmit={handleVerify} className="space-y-4 sm:space-y-6">
            {/* Email Display */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="email"
                value={email}
                disabled
                className="pl-10 bg-gray-100 text-sm"
              />
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Kode OTP (6 digit)
              </label>
              <Input
                type="text"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtpCode(value);
                }}
                placeholder="000000"
                maxLength={6}
                className="text-center text-xl sm:text-2xl tracking-widest font-mono"
                required
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                Kode OTP berlaku selama 10 menit
              </p>
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full text-white py-4 sm:py-5 md:py-6 text-base sm:text-lg"
              style={{ backgroundColor: '#6A4C2E' }}
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi'}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Tidak menerima kode?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="text-amber-700 hover:text-amber-900 text-sm"
              >
                <RefreshCw className={`mr-2 ${resending ? 'animate-spin' : ''}`} size={14} />
                {countdown > 0 
                  ? `Kirim Ulang (${countdown}s)` 
                  : resending 
                    ? 'Mengirim...' 
                    : 'Kirim Ulang OTP'}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-3 sm:pt-4 border-t">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/login')}
                className="text-gray-600 text-sm"
              >
                Kembali ke Login
              </Button>
            </div>
          </form>
        </div>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-3xl text-center">
                🎉 Verifikasi Berhasil!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-lg pt-6 pb-4">
                Email <span className="font-semibold text-amber-900">{email}</span> telah berhasil diverifikasi.
                <br />
                <br />
                Anda akan diarahkan ke halaman login...
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default VerifyOTPPage;

import React, { useState } from "react";
import LogoImg from '../assets/logo_loreomah.png';
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useToast } from "../hooks/use-toast";
import API from "../api/api";
import { startSession } from "../lib/session";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // === LOGIN ===
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new URLSearchParams();
      form.append("username", loginData.email);
      form.append("password", loginData.password);

      let res = await API.post("/auth/user/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast({
        title: "Login berhasil!",
        description: `Selamat datang, ${res.data.user.email}!`,
      });

      // Mulai session berdasarkan role
      startSession(res.data.user.role);
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/", { state: { showReservationPromo: true } });
      }

    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 403) {
        try {
          const formAdmin = new URLSearchParams();
          formAdmin.append("username", loginData.email);
          formAdmin.append("password", loginData.password);

          const resAdmin = await API.post("/auth/admin/login", formAdmin, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          localStorage.setItem("token", resAdmin.data.access_token);
          localStorage.setItem("user", JSON.stringify(resAdmin.data.user));

          toast({
            title: "Login berhasil!",
            description: `Selamat datang kembali, ${resAdmin.data.user.email}!`,
          });

          startSession(resAdmin.data.user.role);
          navigate("/admin/dashboard");
          return;

        } catch (adminErr) {
          toast({
            title: "Login gagal!",
            description: adminErr.response?.data?.detail || "Email atau password salah.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login gagal!",
          description: "Periksa kembali email dan password kamu.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // === REGISTER ===
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowLoadingDialog(true);
    try {
      const res = await API.post("/auth/user/register", {
        email: signupData.email,
        password: signupData.password,
        phone_number: signupData.phone_number,
      });

      // Wait a bit to show the loading animation
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Pendaftaran Berhasil!",
        description: "Kode OTP telah dikirim ke email Anda. Silakan cek email.",
      });

      // Navigate to OTP verification page
      navigate('/verify-otp', { state: { email: signupData.email } });
    } catch (err) {
      setShowLoadingDialog(false);
      toast({
        title: "Registrasi gagal!",
        description: err.response?.data?.detail || "Terjadi kesalahan saat registrasi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 sm:py-10 md:py-12 px-4"
      style={{
        background: "linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%)",
      }}
    >
      <div className="max-w-md w-full">
        {/* HEADER */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-3 sm:mb-4 overflow-hidden">
            <img src={LogoImg} alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Cafe Loreomah</h1>
          <p className="text-amber-200 mt-2 text-sm sm:text-base">Selamat datang kembali!</p>
        </div>

        {/* TAB LOGIN & SIGNUP */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
            <TabsTrigger value="login" className="text-sm sm:text-base">Login</TabsTrigger>
            <TabsTrigger value="signup" className="text-sm sm:text-base">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    placeholder="Enter Email"
                    className="pl-10 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    placeholder="Enter Password"
                    className="pl-10 pr-10 text-sm sm:text-base"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white py-5 sm:py-6 text-base sm:text-lg"
                  style={{ backgroundColor: "#6A4C2E" }}
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Login"}
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* SIGNUP TAB */}
          <TabsContent value="signup">
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
              <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    placeholder="Enter Email"
                    className="pl-10 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="tel"
                    value={signupData.phone_number}
                    onChange={(e) =>
                      setSignupData({ ...signupData, phone_number: e.target.value })
                    }
                    placeholder="Nomor Telepon"
                    className="pl-10 text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type={showSignupPassword ? "text" : "password"}
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    placeholder="Enter Password"
                    className="pl-10 pr-10 text-sm sm:text-base"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm Password"
                    className="pl-10 pr-10 text-sm sm:text-base"
                    required
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white py-5 sm:py-6 text-base sm:text-lg"
                  style={{ backgroundColor: "#6A4C2E" }}
                  disabled={loading}
                >
                  {loading ? "Mendaftarkan..." : "Daftar"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              🎉 Registrasi Berhasil!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base pt-4">
              Akun <span className="font-semibold text-amber-900">{registeredEmail}</span> berhasil dibuat.
              <br />
              <br />
              Silakan login untuk melanjutkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="w-full text-white"
              style={{ backgroundColor: "#6A4C2E" }}
              onClick={() => setShowSuccessDialog(false)}
            >
              Oke, Lanjut Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Dialog - Registration */}
      <AlertDialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              📧 Mengirim Kode OTP
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base pt-6 pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700">
                  Sedang mengirim kode verifikasi ke email Anda...
                  <br />
                  <span className="font-semibold text-amber-900">{signupData.email}</span>
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

export default LoginPage;

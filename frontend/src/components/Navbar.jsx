import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { endSession, isSessionValid, getCurrentUser } from "../lib/session";
import API from "../api/api";
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { User as UserIcon, LogOut, CalendarDays, LayoutDashboard } from "lucide-react";
import LogoImg from '../assets/logo_loreomah.png';
import { useToast } from "../hooks/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(getCurrentUser());
  const [valid, setValid] = useState(isSessionValid());
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoutSuccessDialog, setShowLogoutSuccessDialog] = useState(false);
  const [reservationNotifications, setReservationNotifications] = useState(0);

  const fetchReservationNotifications = () => {
    if (!valid || !user) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    
    API.get('/api/reservations/mine?page=1&size=100', { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(res => {
        const items = res.data.items || [];
        // Count only unread reservations with confirmed or declined status
        const unreadCount = items.filter(r => 
          !r.is_read && (r.status === 'confirmed' || r.status === 'declined')
        ).length;
        setReservationNotifications(unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    // Fetch notifications on mount and when user changes
    fetchReservationNotifications();
    
    // Poll session validity lightly
    const i = setInterval(() => {
      const newValid = isSessionValid();
      if (newValid !== valid) setValid(newValid);
      const latestUser = getCurrentUser();
      if (JSON.stringify(latestUser) !== JSON.stringify(user)) setUser(latestUser);
      if (!newValid && user) {
        setUser(null);
      }
      // Also refresh notifications
      fetchReservationNotifications();
    }, 15000);
    // Listen for profile updates (avatar change etc.)
    const handler = () => {
      const latestUser = getCurrentUser();
      setUser(latestUser);
    };
    // Listen for reservation updates
    const reservationHandler = () => {
      fetchReservationNotifications();
    };
    window.addEventListener('profileUpdated', handler);
    window.addEventListener('reservationUpdated', reservationHandler);
    return () => {
      clearInterval(i);
      window.removeEventListener('profileUpdated', handler);
      window.removeEventListener('reservationUpdated', reservationHandler);
    };
  }, [valid, user]);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    endSession();
    setUser(null);
    setShowLogoutDialog(false);
    setShowLogoutSuccessDialog(true);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: "About Us", path: "/about" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
    <nav className="sticky top-0 z-50 shadow-md" style={{ background: 'linear-gradient(315deg, #6A4C2E 0%, #8B6F47 50%, #6A4C2E 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Only */}
          <Link to="/" className="flex items-center">
            <img
              src={LogoImg}
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium transition-colors ${
                  isActive(link.path) ? "border-b-2 border-amber-200" : ""
                }`}
                style={
                  isActive(link.path)
                    ? { color: "#FFF", borderColor: "#FDE68A" }
                    : { color: "#F5F5DC" }
                }
                onMouseEnter={(e) => (e.target.style.color = "#FFF")}
                onMouseLeave={(e) =>
                  !isActive(link.path) && (e.target.style.color = "#F5F5DC")
                }
              >
                {link.name}
              </Link>
            ))}
            {valid && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-amber-200 text-sm hover:bg-white/10 text-white relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-200 bg-white flex items-center justify-center">
                      {user.avatar_url ? (
                        <img src={user.avatar_url.startsWith('data:') || user.avatar_url.startsWith('http') ? user.avatar_url : `${API_BASE}${user.avatar_url}`}
                             alt="avatar"
                             className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-amber-900 font-semibold">{user.email.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="hidden lg:inline text-white">{user.email}</span>
                    {reservationNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {reservationNotifications}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={8}>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="mr-2" /> Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/booking')}>
                    <CalendarDays className="mr-2" /> Reservasi
                    {reservationNotifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {reservationNotifications}
                      </span>
                    )}
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      <LayoutDashboard className="mr-2" /> Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  className="text-white px-6 border-2 border-white transition-all"
                  style={{ backgroundColor: "#6A4C2E" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.color = "#78350f";
                    e.currentTarget.style.borderColor = "#78350f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#6A4C2E";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#FFFFFF";
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
            {reservationNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {reservationNotifications}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-amber-200" style={{ background: 'linear-gradient(315deg, #6A4C2E 0%, #8B6F47 50%, #6A4C2E 100%)' }}>
          <div className="px-4 pt-2 pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-lg font-medium py-2 transition-colors`}
                style={isActive(link.path) ? { color: "#FFF", fontWeight: "bold" } : { color: "#F5F5DC" }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {valid && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100" style={{background:'#6A4C2E'}}>
                    {user.avatar_url ? (
                      <img src={(user.avatar_url.startsWith('data:') || user.avatar_url.startsWith('http')) ? user.avatar_url : `${API_BASE}${user.avatar_url}`}
                           alt="avatar"
                           className="w-full h-full object-cover"
                           onError={(e)=>{e.currentTarget.style.display='none'}} />
                    ) : (
                      <span className="text-white font-semibold">{user.email.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{user.email}</p>
                    <p className="text-xs text-amber-100">{user.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-amber-200 text-white hover:bg-white hover:text-amber-900" onClick={() => {navigate('/profile'); setIsOpen(false);}}>Profil</Button>
                  <Button variant="outline" className="border-amber-200 text-white hover:bg-white hover:text-amber-900 relative" onClick={() => {navigate('/booking'); setIsOpen(false);}}>
                    Reservasi
                    {reservationNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {reservationNotifications}
                      </span>
                    )}
                  </Button>
                  {user.role === 'admin' && (
                    <Button variant="outline" className="border-amber-200 text-white hover:bg-white hover:text-amber-900" onClick={() => {navigate('/admin/dashboard'); setIsOpen(false);}}>Admin</Button>
                  )}
                  <Button className="col-span-2 text-amber-900 border-2 border-amber-200" style={{background:'#FFF'}} onClick={() => { setIsOpen(false); handleLogout(); }}>Logout</Button>
                </div>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button
                  className="w-full text-white mt-2 border-2 border-white transition-all"
                  style={{ backgroundColor: "#6A4C2E" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                    e.currentTarget.style.color = "#78350f";
                    e.currentTarget.style.borderColor = "#78350f";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#6A4C2E";
                    e.currentTarget.style.color = "#FFFFFF";
                    e.currentTarget.style.borderColor = "#FFFFFF";
                  }}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>

    {/* Logout Confirmation Dialog */}
    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin keluar dari akun?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={confirmLogout}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* Logout Success Dialog */}
    <AlertDialog open={showLogoutSuccessDialog} onOpenChange={(open) => {
      setShowLogoutSuccessDialog(open);
      if (!open) navigate('/');
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">
            👋 Logout Berhasil!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base pt-4">
            Terima kasih telah mengunjungi Cafe Loreomah.
            <br />
            <br />
            Sampai jumpa lagi!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className="w-full text-white"
            style={{ backgroundColor: "#6A4C2E" }}
            onClick={() => {
              setShowLogoutSuccessDialog(false);
              navigate('/');
            }}
          >
            Oke
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default Navbar;

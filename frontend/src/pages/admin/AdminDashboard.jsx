import React, { useState, useEffect } from "react";
import LogoImg from '../../assets/logo_loreomah.png';
import { useNavigate } from "react-router-dom";
import { LogOut, Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import Overview from "./Overview";
import SliderAdmin from "./SliderAdmin";
import MenuAdmin from "./MenuAdmin";
import GalleryAdmin from "./GalleryAdmin";
import BookingsAdmin from "./BookingsAdmin";
import MessagesAdmin from "./MessagesAdmin";
import SettingsAdmin from "./SettingsAdmin";
import API from "../../api/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoutSuccessDialog, setShowLogoutSuccessDialog] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get('/api/messages/?unread_only=true');
      setUnreadCount(res.data.total || 0);
    } catch (error) {
      console.error('Failed to fetch unread messages:', error);
    }
  };

  const fetchPendingReservations = async () => {
    try {
      const res = await API.get('/api/reservations/');
      const data = res.data || [];
      const pending = data.filter(r => r.status === 'pending').length;
      setPendingReservations(pending);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchPendingReservations();
    // Listen for new messages
    const handleMessageSent = () => {
      fetchUnreadCount();
    };
    // Listen for reservation updates
    const handleReservationUpdate = () => {
      fetchPendingReservations();
    };
    window.addEventListener('messageSent', handleMessageSent);
    window.addEventListener('reservationUpdated', handleReservationUpdate);
    return () => {
      window.removeEventListener('messageSent', handleMessageSent);
      window.removeEventListener('reservationUpdated', handleReservationUpdate);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutDialog(false);
    setShowLogoutSuccessDialog(true);
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="text-white shadow-lg" style={{ backgroundColor: "#6A4C2E" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src={LogoImg} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-amber-200">Cafe Loreomah</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button onClick={() => navigate("/")} variant="ghost" className="text-white hover:text-amber-200 text-xs sm:text-sm p-2 sm:p-3">
                <Home className="sm:mr-2" size={16} />
                <span className="hidden sm:inline">Ke Website</span>
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-amber-200 text-xs sm:text-sm p-2 sm:p-3">
                <LogOut className="sm:mr-2" size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 mb-6 sm:mb-8">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-7 mb-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-3 sm:px-4">Overview</TabsTrigger>
              <TabsTrigger value="slider" className="text-xs sm:text-sm px-3 sm:px-4">Slider</TabsTrigger>
              <TabsTrigger value="menu" className="text-xs sm:text-sm px-3 sm:px-4">Menu</TabsTrigger>
              <TabsTrigger value="gallery" className="text-xs sm:text-sm px-3 sm:px-4">Gallery</TabsTrigger>
              <TabsTrigger value="bookings" className="text-xs sm:text-sm px-3 sm:px-4">
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">Reservasi</span>
                  <span className="sm:hidden">Res</span>
                  {pendingReservations > 0 && (
                    <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                      {pendingReservations}
                    </span>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs sm:text-sm px-3 sm:px-4">
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">Pesan</span>
                  <span className="sm:hidden">Msg</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-[10px] sm:text-xs px-1 sm:px-2">
                      {unreadCount}
                    </Badge>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm px-3 sm:px-4">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <Overview />
          </TabsContent>

          <TabsContent value="slider">
            <SliderAdmin />
          </TabsContent>

          <TabsContent value="menu">
            <MenuAdmin />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryAdmin />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsAdmin />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesAdmin />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>

    {/* Logout Confirmation Dialog */}
    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin keluar dari dashboard admin?
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
            Terima kasih telah mengelola Cafe Loreomah.
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

export default AdminDashboard;

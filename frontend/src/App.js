import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditMenuDetail from "./pages/admin/EditMenuDetail";
import EditSlider from "./pages/admin/EditSlider";
import EditGallery from "./pages/admin/EditGallery";
import MenuDetailPage from "./pages/MenuDetailPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "./components/ui/toaster";
import SessionWatcher from "./components/SessionWatcher";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/menu/:category" element={<MenuDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
                <Footer />
              </>
            }
          />

          {/* Auth Routes without Navbar & Footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />

          {/* Admin Routes without Navbar & Footer */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/edit-menu/:name" element={<EditMenuDetail />} />
          <Route path="/admin/edit-slider/:id" element={<EditSlider />} />
          <Route path="/admin/edit-gallery/:id" element={<EditGallery />} />
        </Routes>
        <SessionWatcher />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;

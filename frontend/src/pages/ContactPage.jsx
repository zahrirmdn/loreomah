import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { isSessionValid, getCurrentUser } from '../lib/session';
import API from '../api/api';

const ContactPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoggedIn = isSessionValid();
  const user = getCurrentUser();
  const [sending, setSending] = useState(false);
  const [contactData, setContactData] = useState({
    address: '',
    phone: '',
    email: '',
    weekdays: '09.00 - 19.00',
    weekend: '09.00 - 20.00'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Fetch contact settings
  useEffect(() => {
    API.get('/api/settings/')
      .then(res => setContactData(res.data.contact || contactData))
      .catch(err => console.error('Failed to load contact settings:', err));
  }, []);

  // Prefill name & email from logged in user
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || user.full_name || user.email?.split('@')[0] || '',
        email: user.email || ''
      }));
    }
  }, [isLoggedIn, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk mengirim pesan.",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };
      const res = await API.post('/api/messages/', payload);
      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih, kami akan segera menghubungi Anda.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Refill user identity after reset
      setTimeout(() => {
        if (isLoggedIn && user) {
          setFormData(prev => ({
            ...prev,
            name: user.username || user.full_name || user.email?.split('@')[0] || '',
            email: user.email || ''
          }));
        }
      }, 0);
      window.dispatchEvent(new CustomEvent('messageSent', { detail: res.data?.data }));
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal Mengirim",
        description: error.response?.data?.detail || error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Hero */}
      <div className="text-white py-12 sm:py-16 md:py-20" style={{ background: 'linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Hubungi Kami</h1>
          <p className="text-base sm:text-lg md:text-xl">Kami siap melayani Anda dengan sepenuh hati</p>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Informasi Kontak</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <div className="bg-amber-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Alamat</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{contactData.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <div className="bg-amber-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Telepon</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{contactData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <div className="bg-amber-500 p-2 sm:p-3 rounded-full flex-shrink-0">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Jam Buka</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Weekdays: {contactData.openingHours?.weekdays || "09.00 - 19.00"}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">Weekend: {contactData.openingHours?.weekend || "09.00 - 20.00"}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md overflow-hidden h-48 sm:h-56 md:h-64 relative group cursor-pointer">
                <a 
                  href="https://maps.app.goo.gl/CzTSGZ2omrEyVgqQ9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all"
                >
                  <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-amber-600 px-4 py-2 rounded-lg">
                    Buka di Google Maps
                  </span>
                </a>
                <iframe
                  title="Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.877344956203!2d112.58005607501738!3d-7.479957092547632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78071e24e0854f%3A0x97d71bde09d5b6a3!2sCafe%20Loreomah!5e0!3m2!1sen!2sid!4v1732525000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Kirim Pesan</h2>
              
              <div className="relative">
                <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama Anda"
                      required
                      disabled={!isLoggedIn}
                      className="w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                      disabled={true} // always derive from session
                      className="w-full bg-gray-100 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Subjek
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subjek pesan"
                      required
                      disabled={!isLoggedIn}
                      className="w-full text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Pesan
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tulis pesan Anda..."
                      required
                      disabled={!isLoggedIn}
                      rows={6}
                      className="w-full text-sm"
                    />
                  </div>

                  {isLoggedIn ? (
                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full text-white py-4 sm:py-5 md:py-6 text-base sm:text-lg"
                      style={{ backgroundColor: '#6A4C2E' }}
                    >
                      <Send className="mr-2" size={18} />
                      {sending ? 'Mengirim...' : 'Kirim Pesan'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full text-white py-4 sm:py-5 md:py-6 text-base sm:text-lg"
                      style={{ backgroundColor: '#6A4C2E' }}
                    >
                      <LogIn className="mr-2" size={18} />
                      Login untuk Mengirim Pesan
                    </Button>
                  )}
                </form>

                {/* Blur Overlay when not logged in (covers form only, not heading) */}
                {!isLoggedIn && (
                  <div className="absolute inset-0 rounded-lg flex items-center justify-center z-10 bg-white/60 backdrop-blur-sm pointer-events-none">
                    <div className="text-center pointer-events-auto px-4">
                      <p className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Anda harus login untuk mengirim pesan</p>
                      <Button
                        onClick={() => navigate('/login')}
                        className="text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
                        style={{ backgroundColor: '#6A4C2E' }}
                      >
                        <LogIn className="mr-2" size={18} />
                        Login Sekarang
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
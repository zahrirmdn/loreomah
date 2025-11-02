import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { contactData } from '../mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Pesan Terkirim!",
      description: "Terima kasih, kami akan segera menghubungi Anda."
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Hero */}
      <div className="text-white py-20" style={{ background: 'linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl">Kami siap melayani Anda dengan sepenuh hati</p>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Informasi Kontak</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
                  <div className="bg-amber-500 p-3 rounded-full">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Alamat</h3>
                    <p className="text-gray-600">{contactData.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
                  <div className="bg-amber-500 p-3 rounded-full">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Telepon</h3>
                    <p className="text-gray-600">{contactData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white p-6 rounded-lg shadow-md">
                  <div className="bg-amber-500 p-3 rounded-full">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">{contactData.email}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden h-64">
                <iframe
                  title="Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.4826537861494!2d112.73799731477433!3d-7.257472694767547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f93fc001bc9d%3A0x9dd1f8e0c06e8035!2sSurabaya%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
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
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Kirim Pesan</h2>
              
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama Anda"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjek
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subjek pesan"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tulis pesan Anda..."
                    required
                    rows={6}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white py-6 text-lg"
                >
                  <Send className="mr-2" size={20} />
                  Kirim Pesan
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
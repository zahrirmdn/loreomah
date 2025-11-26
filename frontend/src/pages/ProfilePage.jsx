import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import * as session from '../lib/session';
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const ProfilePage = () => {
  const user = session.getCurrentUser ? session.getCurrentUser() : null;
  const userEmail = user?.email || null;
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      if (!userEmail) return;
      setProfileLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/api/users/me', { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        if (cancelled) return;
        setUsername(res.data.username || '');
        setFullName(res.data.full_name || '');
        setPhone(res.data.phone || '');
        setAddress(res.data.address || '');
        const rawAvatar = res.data.avatar_url || '';
        setAvatarUrl(rawAvatar);
        // If base64 data URL, use directly; otherwise prepend API_BASE
        if (rawAvatar.startsWith('data:')) {
          setAvatarPreview(rawAvatar);
        } else {
          const absolute = rawAvatar ? (rawAvatar.startsWith('http') ? rawAvatar : `${API_BASE}${rawAvatar}`) : '';
          setAvatarPreview(absolute);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          toast({ title: 'Gagal memuat profil', description: 'Silakan coba lagi', variant: 'destructive' });
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }
    loadProfile();
    const handleProfileUpdated = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.avatar_url) {
            setAvatarUrl(parsed.avatar_url);
            // If base64 data URL, use directly
            if (parsed.avatar_url.startsWith('data:')) {
              setAvatarPreview(parsed.avatar_url);
            } else {
              const absolute = parsed.avatar_url.startsWith('http') ? parsed.avatar_url : `${API_BASE}${parsed.avatar_url}`;
              setAvatarPreview(absolute);
            }
          }
        } catch (_) {}
      }
    };
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => { cancelled = true; window.removeEventListener('profileUpdated', handleProfileUpdated); };
  }, [userEmail, toast]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview from file
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!userEmail) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      // Remove avatar by setting empty string
      await API.post('/api/users/me/avatar/remove', {}, { 
        headers: { Authorization: token ? `Bearer ${token}` : undefined } 
      });
      
      setAvatarUrl('');
      setAvatarPreview('');
      setAvatarFile(null);
      
      // Update localStorage
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.avatar_url = '';
          localStorage.setItem('user', JSON.stringify(parsed));
        } catch (_) {}
      }
      
      window.dispatchEvent(new Event('profileUpdated'));
      toast({ title: 'Foto profil dihapus', description: 'Foto profil berhasil dihapus.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal menghapus foto', description: 'Silakan coba lagi', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userEmail) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updatePayload = { username, full_name: fullName, phone, address };
      await API.patch('/api/users/me', updatePayload, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        const avatarRes = await API.post('/api/users/me/avatar', formData, { headers: { Authorization: token ? `Bearer ${token}` : undefined } });
        newAvatarUrl = avatarRes.data.avatar_url;
      }
      setAvatarUrl(newAvatarUrl);
      // Set preview - base64 data URL can be used directly
      if (newAvatarUrl.startsWith('data:')) {
        setAvatarPreview(newAvatarUrl);
      } else {
        const absolute = newAvatarUrl ? (newAvatarUrl.startsWith('http') ? newAvatarUrl : `${API_BASE}${newAvatarUrl}`) : '';
        setAvatarPreview(absolute);
      }
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsed.username = username;
          parsed.avatar_url = newAvatarUrl;
          localStorage.setItem('user', JSON.stringify(parsed));
        } catch (_) {}
      }
      window.dispatchEvent(new Event('profileUpdated'));
      toast({ title: 'Profil diperbarui', description: 'Perubahan berhasil disimpan.' });
      setEditMode(false);
      setAvatarFile(null);
    } catch (e) {
      console.error(e);
      toast({ title: 'Gagal menyimpan', description: 'Periksa input dan coba lagi', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-8 md:py-12 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{color:'#6A4C2E'}}>Profil Akun</h1>
      {user ? (
        <div className="space-y-4 sm:space-y-6 bg-white shadow-md rounded-lg p-4 sm:p-6 border">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-50 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-semibold text-gray-400">{userEmail?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              {editMode && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium cursor-pointer">
                    <span className="px-3 py-1.5 border rounded bg-amber-600 text-white hover:bg-amber-700 inline-block text-center">
                      {avatarFile ? 'Ganti Foto' : 'Upload Foto'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                  {(avatarPreview || avatarUrl) && (
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline" 
                      onClick={handleRemoveAvatar}
                      disabled={saving}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Hapus Foto
                    </Button>
                  )}
                  {avatarFile && (
                    <p className="text-xs text-green-600 text-center">Preview foto baru</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4">
              {!editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="font-medium">{username || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nama Lengkap</p>
                    <p className="font-medium">{fullName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">No. Telepon</p>
                    <p className="font-medium">{phone || '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">Alamat</p>
                    <p className="font-medium">{address || '-'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Username</label>
                    <Input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Nama Lengkap</label>
                    <Input value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Nama Lengkap" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">No. Telepon</label>
                    <Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="08xxxx" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-500">Alamat</label>
                    <Input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Alamat" />
                  </div>
                  <div className="flex gap-3 md:col-span-2 mt-2">
                    <Button type="submit" disabled={saving || profileLoading}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
                    <Button type="button" variant="outline" onClick={() => { setEditMode(false); setAvatarPreview(avatarUrl); setAvatarFile(null); }}>Batal</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
          {!editMode && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setEditMode(true)}>Edit Profil</Button>
            </div>
          )}
        </div>
      ) : (
        <p>Belum login.</p>
      )}
    </div>
  );
};

export default ProfilePage;

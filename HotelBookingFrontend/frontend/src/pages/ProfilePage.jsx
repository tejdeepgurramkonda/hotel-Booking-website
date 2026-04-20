import { useState, useEffect } from 'react';
import { getMyProfile, createUserProfile, updateUserProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal Info');

  useEffect(() => {
    console.log('👤 ProfilePage: user from AuthContext:', user);
    console.log('💾 localStorage user:', localStorage.getItem('user'));
    console.log('🔑 localStorage token:', localStorage.getItem('token') ? 'exists' : 'missing');
    
    getMyProfile()
      .then(r => { 
        console.log('✅ Profile loaded:', r.data);
        setProfile(r.data); 
        setForm({ name: r.data.name || '', location: r.data.location || '' }); 
        setHasProfile(true); 
      })
      .catch(err => { 
        console.error('❌ Profile fetch error:', err.response?.status, err.response?.data);
        setHasProfile(false); 
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      if (hasProfile) {
        const res = await updateUserProfile(user.userId, form);
        setProfile(res.data);
        toast.success('Profile updated successfully!');
      } else {
        const res = await createUserProfile(form);
        setProfile(res.data);
        setHasProfile(true);
        toast.success('Profile created successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Guest';

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="pt-16 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {['Personal Info', 'Security', 'Preferences', 'Booking History'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-4 px-4 py-3 ${
                    activeTab === tab 
                      ? 'text-slate-900 dark:text-white font-bold border-b-2 border-amber-600' 
                      : 'text-slate-500 hover:text-amber-700'
                  } transition-all`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {tab === 'Personal Info' ? 'person' : 
                     tab === 'Security' ? 'shield' : 
                     tab === 'Preferences' ? 'tune' : 'history'}
                  </span>
                  <span className={`font-label text-sm tracking-wide ${activeTab !== tab ? 'uppercase opacity-80' : ''}`}>
                    {tab}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-12 p-6 bg-surface-container-low rounded-lg relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-label uppercase tracking-widest text-secondary mb-2">Membership</p>
                <h4 className="font-headline text-xl text-primary mb-4">Gold Tier Elite</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  You are 2 stays away from Platinum status.
                </p>
                <button className="text-xs font-bold border-b border-primary pb-1 uppercase tracking-tighter hover:text-amber-700 transition-colors">
                  View Benefits
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-grow space-y-16">
            
            {/* Profile Header */}
            <header className="flex flex-col md:flex-row items-center md:items-end gap-8 pb-12 border-b border-outline-variant/10">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-xl flex items-center justify-center bg-amber-100 text-amber-700 text-5xl font-serif">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </button>
              </div>
              
              <div className="text-center md:text-left flex-grow">
                <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-2 block">Welcome Back</span>
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-primary -tracking-wider mb-2">
                  {displayName}
                </h1>
                <p className="text-on-surface-variant font-inter italic">Member since October 2021</p>
              </div>
            </header>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
              
              {/* Personal Information */}
              <div className="space-y-8">
                <div>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Section 01</span>
                  <h2 className="font-headline text-3xl text-primary">Personal Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Your full name"
                      className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      readOnly
                      className="w-full bg-surface-container-low/50 border-none rounded-lg px-4 py-3 text-primary/70 font-inter cursor-not-allowed outline-none" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">Location</label>
                    <input 
                      type="text" 
                      value={form.location}
                      onChange={e => setForm({...form, location: e.target.value})}
                      placeholder="City, Country"
                      className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Security - Readonly demo for UI accuracy */}
              <div className="space-y-8 opacity-60 pointer-events-none">
                <div>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Section 02</span>
                  <h2 className="font-headline text-3xl text-primary">Security</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">Current Password</label>
                    <input type="password" value="********" readOnly className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-primary font-inter" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">New Password</label>
                    <input placeholder="Min. 12 characters" type="password" readOnly className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-primary font-inter placeholder:text-on-surface-variant/40" />
                  </div>
                  <div className="pt-2">
                    <button className="flex items-center gap-2 text-sm font-semibold text-secondary transition-colors" type="button">
                      <span className="material-symbols-outlined text-base">lock_reset</span>
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                </div>
              </div>

              {/* Travel Preferences - Readonly demo for UI accuracy */}
              <div className="lg:col-span-2 space-y-8 pt-8 border-t border-outline-variant/10 opacity-60 pointer-events-none">
                <div>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Section 03</span>
                  <h2 className="font-headline text-3xl text-primary">Travel Preferences</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">Preferred Room Type</label>
                    <select className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-primary font-inter appearance-none" disabled>
                      <option>Penthouse Suite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">Dietary Restrictions</label>
                    <input type="text" value="Gluten-free, Pescatarian" readOnly className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-primary font-inter" />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1">Special Occasions & Notes</label>
                    <textarea readOnly className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-primary font-inter resize-none" rows="3" defaultValue="I usually travel for my wedding anniversary in June. I appreciate high-floor rooms away from elevators."></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-outline-variant/10">
              <p className="text-sm text-on-surface-variant italic cursor-default">
                Last updated {profile?.name ? 'recently' : 'never'}
              </p>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setForm({ name: profile?.name || '', location: profile?.location || '' })} 
                  className="flex-1 sm:flex-none px-8 py-4 text-sm font-bold text-primary hover:bg-surface-container-high rounded-lg transition-colors font-label tracking-wide uppercase"
                >
                  Reset
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="flex-1 sm:flex-none px-12 py-4 bg-primary text-on-primary hover:bg-slate-800 rounded-lg transition-all shadow-lg font-label text-sm font-bold tracking-widest uppercase disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

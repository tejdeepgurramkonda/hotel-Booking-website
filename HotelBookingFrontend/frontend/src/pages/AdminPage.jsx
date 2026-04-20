import { useEffect, useState } from 'react';
import { getAllHotels, addHotel, updateHotel, deleteHotel } from '../api';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const EMPTY = { name: '', city: '', address: '', price: '', rating: '', description: '' };

export default function AdminPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchHotels(); }, []);

  async function fetchHotels() {
    try { const r = await getAllHotels(); setHotels(r.data); }
    catch { toast.error('Failed to load hotels'); }
    finally { setLoading(false); }
  }

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(h) {
    setEditing(h.id);
    setForm({ name: h.name, city: h.city, address: h.address || '', price: h.price, rating: h.rating, description: h.description || '' });
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), rating: Number(form.rating) };
      if (editing) { await updateHotel(editing, data); toast.success('Hotel updated!'); }
      else { await addHotel(data); toast.success('Hotel added!'); }
      setShowForm(false);
      fetchHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this hotel?')) return;
    try { await deleteHotel(id); toast.success('Deleted'); fetchHotels(); }
    catch { toast.error('Delete failed'); }
  }

  const totalHotels = hotels.length;
  const avgPrice = totalHotels
    ? hotels.reduce((sum, h) => sum + Number(h.price || 0), 0) / totalHotels
    : 0;
  const avgRating = totalHotels
    ? hotels.reduce((sum, h) => sum + Number(h.rating || 0), 0) / totalHotels
    : 0;

  function usdFromInr(amount) {
    return Math.round(Number(amount || 0) / 83).toLocaleString('en-US');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="pt-16 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <header className="mb-20 pb-12 border-b border-outline-variant/10">
          <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary mb-4 block">Management Panel</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="font-headline text-5xl lg:text-6xl text-primary -tracking-wider mb-3">Your Residencies</h1>
              <p className="text-on-surface-variant font-inter text-lg max-w-2xl">Curate your portfolio, adjust pricing, and monitor guest feedback in one editorial hub.</p>
            </div>
            <button 
              onClick={openAdd}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label text-sm font-bold uppercase tracking-widest hover:bg-amber-700 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Listing
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 bg-surface-container-low rounded-lg border border-outline-variant/10">
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Total Listings</span>
            <div className="font-headline text-5xl text-primary -tracking-wider">{totalHotels}</div>
            <p className="text-on-surface-variant text-sm mt-3">Active residencies in your portfolio</p>
          </div>
          <div className="p-8 bg-surface-container-low rounded-lg border border-outline-variant/10">
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Average Nightly Rate</span>
            <div className="font-headline text-5xl text-primary -tracking-wider">${usdFromInr(avgPrice)}</div>
            <p className="text-on-surface-variant text-sm mt-3">Portfolio average</p>
          </div>
          <div className="p-8 bg-surface-container-low rounded-lg border border-outline-variant/10">
            <span className="font-label text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">Guest Rating</span>
            <div className="font-headline text-5xl text-amber-600 -tracking-wider">{avgRating ? avgRating.toFixed(1) : '0.0'}</div>
            <p className="text-on-surface-variant text-sm mt-3">Portfolio average</p>
          </div>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-200 bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div className="bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl w-full max-w-lg my-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 md:p-8">
                <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3 block">{editing ? 'Edit' : 'Create'}</span>
                <h2 className="font-headline text-4xl text-primary -tracking-wider mb-2">{editing ? 'Edit Listing' : 'New Residency'}</h2>
                <p className="text-on-surface-variant mb-8 font-inter">Provide complete information so guests can discover your property with ease.</p>
                
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-label text-xs font-medium text-on-surface-variant ml-1 block">Property Name *</label>
                      <input 
                        type="text"
                        value={form.name} 
                        onChange={e => setForm({ ...form, name: e.target.value })} 
                        required 
                        placeholder="Grand Palace Hotel"
                        className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label text-xs font-medium text-on-surface-variant ml-1 block">City *</label>
                      <input 
                        type="text"
                        value={form.city} 
                        onChange={e => setForm({ ...form, city: e.target.value })} 
                        required 
                        placeholder="Mumbai"
                        className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1 block">Address</label>
                    <input 
                      type="text"
                      value={form.address} 
                      onChange={e => setForm({ ...form, address: e.target.value })} 
                      placeholder="123, MG Road, Mumbai"
                      className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-label text-xs font-medium text-on-surface-variant ml-1 block">Base Price (₹/night) *</label>
                      <input 
                        type="number" 
                        min="0" 
                        value={form.price} 
                        onChange={e => setForm({ ...form, price: e.target.value })} 
                        required 
                        placeholder="2500"
                        className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label text-xs font-medium text-on-surface-variant ml-1 block">Rating (1–5)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={form.rating} 
                        onChange={e => setForm({ ...form, rating: e.target.value })} 
                        placeholder="4.5"
                        className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-label text-xs font-medium text-on-surface-variant ml-1 block">Description</label>
                    <textarea 
                      value={form.description} 
                      onChange={e => setForm({ ...form, description: e.target.value })} 
                      rows={4} 
                      placeholder="Tell guests about your unique property…"
                      className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-3 text-primary font-inter outline-none resize-none" 
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-6 border-t border-outline-variant/10">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)}
                      className="px-8 py-3 text-primary hover:bg-surface-container-high rounded-lg font-label text-sm font-bold uppercase tracking-widest transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="px-12 py-3 bg-primary text-on-primary hover:bg-amber-700 rounded-lg font-label text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {saving ? 'Saving…' : editing ? 'Update Listing' : 'Create Listing'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Hotels List */}
        <div>
          <div className="mb-12">
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3 block">Collection</span>
            <h2 className="font-headline text-4xl text-primary -tracking-wider">All Listings</h2>
          </div>

          {hotels.length === 0 ? (
            <div className="text-center py-20 px-8 bg-surface-container-low rounded-lg border border-outline-variant/10">
              <span className="text-6xl mb-6 block">🏨</span>
              <h3 className="font-headline text-3xl text-primary mb-3 -tracking-wider">No listings yet</h3>
              <p className="text-on-surface-variant mb-8 max-w-md mx-auto">Start curating your portfolio by adding your first residency to the collection.</p>
              <button 
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label text-sm font-bold uppercase tracking-widest hover:bg-amber-700 transition-all"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {hotels.map(h => (
                <div 
                  key={h.id}
                  className="group p-6 bg-surface-container-low border border-outline-variant/10 hover:border-primary/40 rounded-lg transition-all hover:bg-surface-container-high"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="font-label text-xs font-bold uppercase tracking-widest text-secondary">#{h.id}</span>
                        <h3 className="font-headline text-xl text-primary -tracking-wider">{h.name}</h3>
                      </div>
                      {h.description && (
                        <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{h.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">location_on</span>
                          <span className="text-on-surface-variant font-inter">{h.city}</span>
                          {h.address && <span className="text-on-surface-variant text-xs opacity-60">— {h.address}</span>}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-headline text-primary -tracking-wider">${usdFromInr(h.price)}</span>
                          <span className="text-on-surface-variant text-xs font-inter">/night</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-amber-600" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                          <span className="font-headline text-amber-600 -tracking-wider">{(h.rating || 0).toFixed(1)}</span>
                          <span className="text-on-surface-variant text-xs font-inter">/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:flex-shrink-0">
                      <button 
                        onClick={() => openEdit(h)}
                        className="p-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                        title="Edit listing"
                        aria-label={`Edit ${h.name}`}
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(h.id)}
                        className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Delete listing"
                        aria-label={`Delete ${h.name}`}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}

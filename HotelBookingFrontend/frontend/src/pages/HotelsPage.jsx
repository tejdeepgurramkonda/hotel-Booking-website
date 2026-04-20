import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHotels } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getHotelImage } from '../utils/hotelImages';
import Footer from '../components/Footer';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchHotels(); }, []);

  async function fetchHotels(c = '') {
    setLoading(true);
    try {
      const res = await getAllHotels(c || undefined);
      setHotels(res.data);
    } catch {
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    if(e) e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/search');
    }
  }

  return (
    <>
      <section className="relative h-[870px] min-h-[600px] w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbAHJ5IIbpoDSftGe_BvkAzPscMAtCNmoBqN1HCRZ4bbFOjcHp0FdMdDRJHFghE8ZHIUXudmVY9TGRKQFwXNn4XpaoEtJ4FQVP_x5WU1bUe3krdXrUTFWKIVZTVvV96O8oMLa8-ILCXRTyS9Bo8rLKRhQQH794sU_LggK2BlpRD0dvxBqKFXSJDx4WfUtw_WaJaQFyHKhw94lIXfHtIcARsE5zH432RgxsiJbMPZvsQbNFvIXa0pB59edtclj3eRuMinPuRa3GmvVQ" alt="Hero" />
          <div className="absolute inset-0 bg-primary/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="label-md uppercase tracking-[0.2em] text-on-primary mb-4 block font-medium">The Modern Concierge</span>
          <h1 className="font-headline text-5xl md:text-7xl text-on-primary font-bold tracking-tight mb-6">Redefining the Art of Travel</h1>
          <p className="text-lg md:text-xl text-on-primary/90 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Curated collections of the world's most exquisite stays, designed for the discerning explorer.
          </p>
        </div>

        <div className="relative z-20 w-full max-w-6xl px-6 -mb-24 mt-auto">
          <form onSubmit={handleSearch} className="bg-surface-container-lowest p-2 rounded-xl editorial-shadow grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
            <div className="flex flex-col px-4 py-3 hover:bg-surface-container-low transition-colors rounded-lg cursor-pointer border-r border-outline-variant/10">
              <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Destination</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">location_on</span>
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline font-medium w-full" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col px-4 py-3 hover:bg-surface-container-low transition-colors rounded-lg cursor-pointer border-r border-outline-variant/10">
              <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Check In</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">calendar_today</span>
                <input type="text" placeholder="Add date" className="bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline font-medium w-full" />
              </div>
            </div>
            <div className="flex flex-col px-4 py-3 hover:bg-surface-container-low transition-colors rounded-lg cursor-pointer border-r border-outline-variant/10">
              <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Check Out</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">calendar_month</span>
                <input type="text" placeholder="Add date" className="bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline font-medium w-full" />
              </div>
            </div>
            <div className="flex flex-col px-4 py-3 hover:bg-surface-container-low transition-colors rounded-lg cursor-pointer">
              <label className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Guests</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">group</span>
                <input type="text" placeholder="Add guests" className="bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-outline font-medium w-full" />
              </div>
            </div>
            <div className="p-2">
              <button type="submit" className="w-full h-full bg-secondary-fixed text-on-secondary-fixed py-4 rounded-lg font-bold tracking-tight hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">search</span>
                Search Hotels
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="pt-40 pb-20 px-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <span className="label-md uppercase tracking-widest text-secondary font-bold mb-2 block">The Collection</span>
            <h2 className="font-headline text-4xl text-on-surface font-bold">Featured Hotels</h2>
            <p className="text-on-surface-variant mt-4 leading-relaxed">
              Handpicked residences where architectural marvel meets unparalleled hospitality. These are the stays our editors can't stop talking about.
            </p>
          </div>
          <button onClick={() => navigate('/search')} className="border-b-2 border-primary text-primary font-bold py-1 hover:text-secondary hover:border-secondary transition-colors cursor-pointer">
            View All Residencies
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-4 text-center">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div className="col-span-4 text-center">No hotels found.</div>
          ) : (
            hotels.slice(0, 4).map((hotel, index) => (
              <div key={hotel.id} className="group cursor-pointer" onClick={() => navigate(`/hotels/${hotel.id}`)}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
                  <img src={getHotelImage(hotel, { width: 900, height: 1200 })} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {index === 0 && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter font-bold text-primary">
                      Limited Edition
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline text-xl text-on-surface group-hover:text-secondary transition-colors truncate" title={hotel.name}>{hotel.name}</h3>
                    <div className="flex items-center text-secondary whitespace-nowrap ml-2">
                      <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="text-xs font-bold ml-1">{(hotel.rating || 4.5).toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-on-surface-variant text-sm flex items-center gap-1 mb-3 truncate">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {hotel.city} {hotel.address && `, ${hotel.address}`}
                  </p>
                  <p className="text-primary font-bold">
                    ${Math.round((hotel.price || 0) / 83).toLocaleString('en-US')} <span className="text-on-surface-variant font-normal text-xs">/ night</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="py-24 bg-surface-container-low">
        <div className="px-8 max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="label-md uppercase tracking-[0.3em] text-secondary font-bold mb-3 block">Global Compass</span>
            <h2 className="font-headline text-5xl text-on-surface font-bold">Popular Destinations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-[400px] group overflow-hidden rounded-lg cursor-pointer">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu85d45SXuZEmwyMxyU4jkjBSSohpY5HHC6lgp_aDHcyWaqH1q9TqItewy7ZzyH_47Ky1wAeE6xQG4Bn_Dg6V_9rZfZjlaCIrIT6bnbsHKOOKbOu1oVL6vhW6wp1MwIKqo0zS30xyukee_kn_XjlczBlSOqxsZJTK62AT0-4oOa7WvhGXfmYjbMrmUGkthA9_h9mD4xNWtCWIYQtyi9TOd3LS7yrXZ-ZrlQKNkYcaJs38VDDBpSlu-lj194Ud2vt8AVmorLTz7Hu4o" alt="Dest" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="font-headline text-3xl text-white mb-2 italic">Florence</h4>
                <p className="text-white/80 text-sm tracking-widest uppercase">142 Properties Available</p>
              </div>
            </div>
            <div className="relative h-[400px] group overflow-hidden rounded-lg cursor-pointer">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuADhHpCvYJ0la9DDMdqoOsbCkCtzBXqYfG2T52mE_XAGDQnEk0oQBgeRh88KjkO2dOedkzLGcQyUunqR3ghzl2xguJN7llvlK4ao4_0XGTPnPOkqCquq4XJCvYLp15AHMiZHla-imGak-IM66O39VpGUSWJF_Q9Lm1FLjyg0YxcgU8ka-qnGa03N4OO7FvBr3D4O7U6DfOzpHXIS_epDaF5Sg1HEjgPPl8JdGQPJWVGyaDBdRz50Mnt_M_vy4RU19RiHaNC8NmnPqdb" alt="Dest" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="font-headline text-3xl text-white mb-2 italic">Tokyo</h4>
                <p className="text-white/80 text-sm tracking-widest uppercase">89 Properties Available</p>
              </div>
            </div>
            <div className="relative h-[400px] group overflow-hidden rounded-lg cursor-pointer">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuATxM8GxTaoQk91ghWjc1PZMKVM4QpqoeMG2Y9tXoUChOuKng6JCen6ZNBNwxyvB5fGMD76URGI4_WqHqRV31WeIBFAejw0dX5rc6oO_7DGx230D_wD5-Bbukh1j7YyoVNqQHnDHZtmUD4Kx6Sl8YPc94imDMJD3OmPWmf0nQkWZxGflSiXtcThJAyRs28d7IY0UGp2Qzf-sys9-rKuhiiWDERo8FNNaW8ya3J_Nj7EpKTNCeRHeCDYJjCUdzrPpNP37yQMBl-e1c-h" alt="Dest" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="font-headline text-3xl text-white mb-2 italic">Paris</h4>
                <p className="text-white/80 text-sm tracking-widest uppercase">215 Properties Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-on-primary py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">Join the Editorial Circle</h2>
          <p className="text-primary-container mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
            Subscribe for early access to curated hotel openings, seasonal escape guides, and exclusive member-only rates across the globe.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input type="email" placeholder="Enter your email address" className="flex-grow bg-white/10 border-none px-6 py-4 rounded focus:ring-2 focus:ring-secondary text-white placeholder:text-white/40" />
            <button className="bg-secondary-fixed text-on-secondary-fixed px-8 py-4 rounded font-bold hover:opacity-90 transition-all">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

import { useEffect, useState } from 'react';
import { getAllBookings, cancelBooking, getAllHotels } from '../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHotelImage } from '../utils/hotelImages';
import Footer from '../components/Footer';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Bookings');
  const { user } = useAuth();
  const navigate = useNavigate();

  const tabs = ['All Bookings', 'Upcoming', 'Completed', 'Cancelled'];

  useEffect(() => { fetchData(); }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      const [bRes, hRes] = await Promise.all([
        getAllBookings(),
        getAllHotels()
      ]);
      
      const hMap = {};
      hRes.data.forEach(h => hMap[h.id] = h);
      setHotels(hMap);

      let filteredBookings = bRes.data;
      
      // Filter by user role
      if (user?.role !== 'ADMIN') {
        filteredBookings = filteredBookings.filter(b => b.userId === user?.userId);
      }
      
      // Filter by tab status
      if (activeTab !== 'All Bookings') {
        filteredBookings = filteredBookings.filter(b => {
          const category = getStatusCategory(b);
          return category === activeTab;
        });
      } else {
        // If viewing "All Bookings", exclude cancelled and failed
        filteredBookings = filteredBookings.filter(b => 
          !(b.status?.toUpperCase() === 'CANCELLED' || b.status?.toUpperCase() === 'FAILED')
        );
      }
      
      // Sort by check-in date (newest first)
      filteredBookings.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
      
      setBookings(filteredBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel booking');
    }
  }

  function formatDate(dt) {
    if (!dt) return '';
    return new Date(dt).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function getStatusCategory(b) {
    if (b.status === 'CANCELLED' || b.status === 'FAILED') return 'Cancelled';
    if (b.status === 'BOOKED') {
      if (new Date(b.checkOut) < new Date()) return 'Completed';
      return 'Upcoming';
    }
    return 'Upcoming'; 
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="max-w-screen-2xl mx-auto px-8 py-12">
        <header className="mb-12">
          <span className="label-md uppercase tracking-[0.15em] text-secondary font-semibold text-xs mb-2 block">
            Personal Concierge
          </span>
          <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tight mb-4">
            Your Grand Itinerary
          </h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            View and manage your past and upcoming stays at the world\'s most prestigious destinations.
          </p>
        </header>

        <div className="flex items-center space-x-12 mb-10 border-b border-outline-variant/20 pb-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? "text-amber-700 font-semibold border-b-2 border-amber-700 pb-4 px-2 -mb-0.5 whitespace-nowrap"
                  : "text-on-surface-variant hover:text-on-surface pb-4 px-2 transition-colors whitespace-nowrap"
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant border border-dashed border-outline-variant rounded-lg">
              <p className="text-lg mb-4">No bookings found in this category.</p>
              <button 
                onClick={() => navigate('/hotels')} 
                className="bg-primary text-on-primary px-6 py-2 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Browse Hotels
              </button>
            </div>
          ) : (
            bookings.map((b, idx) => {
              const actualHotelId = b.hotelId || b.HotelId;
              const hotel = hotels[actualHotelId] || { name: 'Hotel #' + actualHotelId, city: 'Unknown Destination' };
              const category = getStatusCategory(b);
              const isCancelled = category === 'Cancelled';
              const isCompleted = category === 'Completed';
              const isUpcoming = category === 'Upcoming';
              
              let statusClasses = "";
              if (isUpcoming) statusClasses = "text-secondary-fixed-dim bg-secondary-container/20";
              else if (isCompleted) statusClasses = "text-on-surface-variant bg-surface-container-high";
              else if (isCancelled) statusClasses = "text-error border border-error/20";
              
              let cardClasses = "group bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_48px_48px_-12px_rgba(1,29,53,0.06)] hover:-translate-y-1 transition-transform duration-300 pointer-events-auto border border-transparent";
              if (isCompleted) cardClasses = "group bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col md:flex-row shadow-[0_48px_48px_-12px_rgba(1,29,53,0.06)] opacity-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-300";
              if (isCancelled) cardClasses = "group bg-surface-container-low/50 border border-outline-variant/10 rounded-lg overflow-hidden flex flex-col md:flex-row";

              const imageSrc = getHotelImage({ id: actualHotelId, ...hotel }, { width: 800, height: 600 });

              return (
                <div key={b.id} className={cardClasses}>
                  <div className={'w-full md:w-72 h-48 md:h-auto overflow-hidden ' + (isCancelled ? 'opacity-40 grayscale' : '')}>
                    <img 
                      alt={hotel.name} 
                      src={imageSrc} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  
                  <div className="flex-grow p-8 flex flex-col md:flex-row justify-between">
                    <div className="space-y-4">
                      <div>
                        <span className={'text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm inline-block mb-2 font-bold ' + statusClasses}>
                          {b.status === 'FAILED' ? 'Failed' : b.status === 'PENDING' ? 'Pending' : category}
                        </span>
                        <h3 className={'text-2xl font-headline font-semibold ' + (isCancelled ? 'text-on-surface/50' : 'text-primary')}>
                          {hotel.name}
                        </h3>
                        <p className="text-on-surface-variant text-sm flex items-center gap-2 mt-1">
                          <span className="material-symbols-outlined text-base">bed</span>
                          {hotel.city} • {b.roomType || 'Standard Room'}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 pt-2">
                        <div>
                          <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Check-in</p>
                          <p className={'font-medium ' + (isCancelled ? 'text-on-surface-variant' : '')}>
                            {formatDate(b.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Check-out</p>
                          <p className={'font-medium ' + (isCancelled ? 'text-on-surface-variant' : '')}>
                            {formatDate(b.checkOut)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 md:mt-0 flex flex-col justify-between items-end">
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-on-surface-variant tracking-wider">Booking ID</p>
                        <p className="font-mono text-xs text-primary">
                          #LX-{(b.id || 0).toString().padStart(6, '0')}
                        </p>
                      </div>
                      
                      <div className="text-right mt-4 md:mt-0 flex flex-col items-end">
                        <p className={'text-3xl font-headline font-bold ' + (isCancelled ? 'text-on-surface-variant opacity-60' : 'text-primary')}>
                          ₹{(b.price || 0).toLocaleString('en-IN')}
                        </p>
                        
                        <div className="flex gap-4 mt-4">
                          {isUpcoming && (
                            <>
                              <button 
                                onClick={() => handleCancel(b.id)}
                                className="text-sm font-medium text-error hover:underline flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm pt-0.5">cancel</span> Cancel
                              </button>
                              <button 
                                onClick={() => navigate('/hotels/' + actualHotelId)}
                                className="bg-primary text-on-primary px-6 py-2 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
                              >
                                View Details
                              </button>
                            </>
                          )}
                          {isCompleted && (
                            <button 
                              onClick={() => navigate('/hotels/' + actualHotelId)}
                              className="bg-amber-100 text-amber-900 px-6 py-2 rounded-sm text-sm font-medium hover:bg-amber-200 transition-colors flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">replay</span> Rebook Stay
                            </button>
                          )}
                          {isCancelled && b.status === 'CANCELLED' && (
                            <span className="text-sm font-medium text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">receipt_long</span> Refund Details
                            </span>
                          )}
                          {isCancelled && b.status === 'FAILED' && (
                            <button className="text-sm font-medium text-error flex items-center gap-1 opacity-70 cursor-default">
                                <span className="material-symbols-outlined text-sm pt-0.5">error</span> Failed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {bookings.length > 0 && (
          <div className="mt-12 text-center pb-8 border-t border-outline-variant/10 pt-8">
            <button className="bg-primary text-on-primary px-8 py-3 rounded-sm font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2">
              Load More History <span className="material-symbols-outlined text-sm mt-0.5">expand_more</span>
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

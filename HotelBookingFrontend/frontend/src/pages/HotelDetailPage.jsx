import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotel, checkAvailability } from '../api';
import { useAuth } from '../context/AuthContext';
import { useAvailability } from '../context/AvailabilityContext';
import toast from 'react-hot-toast';
import { getHotelImage } from '../utils/hotelImages';
import Footer from '../components/Footer';

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchAvailability, getAvailableRoomCount } = useAvailability();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ checkIn: '', checkOut: '' });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState('DELUXE');
  const [availabilityInfo, setAvailabilityInfo] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);

  useEffect(() => {
    getHotel(id)
      .then(r => setHotel(r.data))
      .catch(() => toast.error('Hotel not found'))
      .finally(() => setLoading(false));
  }, [id]);

  // Check availability whenever dates or room type changes
  useEffect(() => {
    if (!form.checkIn || !form.checkOut || !roomType || !id) return;

    const checkDateAvailability = async () => {
      try {
        setCheckingAvail(true);
        const checkInDate = new Date(form.checkIn);
        const checkOutDate = new Date(form.checkOut);

        if (checkInDate >= checkOutDate) {
          setAvailabilityInfo(null);
          return;
        }

        // Fetch availability data for visualization
        await fetchAvailability(parseInt(id), roomType, checkInDate, checkOutDate);

        // Check if available for booking
        const isAvailable = await checkAvailability(parseInt(id), roomType, checkInDate, checkOutDate);
        
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
        const availCount = getAvailableRoomCount(parseInt(id), roomType, checkInDate, checkInDate, checkOutDate);

        setAvailabilityInfo({
          isAvailable,
          nights,
          availableCount: availCount,
          message: isAvailable 
            ? `${availCount} rooms available` 
            : 'Not available for selected dates'
        });
      } catch (err) {
        console.error('Error checking availability:', err);
        setAvailabilityInfo({ isAvailable: false, message: 'Could not verify availability' });
      } finally {
        setCheckingAvail(false);
      }
    };

    checkDateAvailability();
  }, [form.checkIn, form.checkOut, roomType, id, fetchAvailability, getAvailableRoomCount]);

  const handleBook = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!form.checkIn || !form.checkOut) { toast.error('Please select dates'); return; }

    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);
    if (checkInDate >= checkOutDate) {
      toast.error('Check-out must be after check-in');
      return;
    }

    // Verify availability before navigating to checkout
    if (availabilityInfo && !availabilityInfo.isAvailable) {
      toast.error('Selected room type is not available for the chosen dates');
      return;
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
    const priceINR = hotel.price;
    const totalAmount = priceINR * nights;

    navigate('/checkout', {
      state: {
        hotelId: id,
        hotel,
        form: { ...form, checkIn: form.checkIn + 'T14:00:00', checkOut: form.checkOut + 'T11:00:00' },
        adults,
        children,
        roomType,
        nights,
        priceINR,
        totalAmount
      }
    });
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="text-primary font-headline text-2xl">Loading...</div></div>;
  if (!hotel) return <div className="min-h-screen bg-surface flex items-center justify-center"><p className="text-on-surface">Hotel not found.</p></div>;

  const priceINR = hotel.price;
  const roomTypeEnumMap = { 'DELUXE': 'Deluxe Sea View Suite', 'HERITAGE': 'Heritage King Suite', 'PENTHOUSE': 'Penthouse Residence' };
  const roomTypeDisplayName = roomTypeEnumMap[roomType] || roomType;

  return (
    <div className="bg-surface text-on-surface">
      {/* Hero Section - Full Bleed Image */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <img 
          alt={hotel.name}
          className="w-full h-full object-cover"
          src={getHotelImage(hotel, { width: 1600, height: 900 })}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        
        {/* Hero Content - Editorial Layout */}
        <div className="absolute bottom-0 left-0 w-full p-16 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Category Label - Brow */}
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary-fixed text-2xl">star</span>
              <span className="text-xs uppercase tracking-widest font-bold text-secondary-fixed">5-Star Heritage Estate</span>
            </div>
            
            {/* Main Headline - Serif */}
            <h1 className="text-6xl md:text-7xl font-serif font-bold text-on-primary tracking-tight mb-6 leading-none">
              {hotel.name}
            </h1>
            
            {/* Location */}
            <div className="flex items-center gap-2 text-on-primary/90">
              <span className="material-symbols-outlined">location_on</span>
              <span className="text-lg">{hotel.city}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Asymmetrical Grid */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Left Column - Content (wider) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Gallery Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 h-96">
                <div className="col-span-2 row-span-2 rounded-lg overflow-hidden">
                  <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    src={getHotelImage(hotel, { width: 1000, height: 800 })} 
                    alt="Suite" />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    src={getHotelImage(hotel, { width: 500, height: 500, offset: 1 })} 
                    alt="Pool" />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    src={getHotelImage(hotel, { width: 500, height: 500, offset: 2 })} 
                    alt="Spa" />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <article className="space-y-6 border-b border-outline-variant/20 pb-12">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-secondary mb-3 block">The Experience</span>
                <h2 className="text-4xl font-serif font-bold mb-6">A Sanctuary of Timeless Elegance</h2>
              </div>
              <p className="text-lg leading-relaxed text-on-surface-variant max-w-2xl">
                {hotel.description || 'Perched atop the jagged cliffs of the Mediterranean, this sanctuary offers an unparalleled retreat for the discerning traveler. Originally commissioned as a private residence for European royalty, every corridor whispers stories of a gilded age, reimagined with contemporary sophistication. Experience world-class hospitality where the boundary between the horizon and infinity dissolves.'}
              </p>
              {hotel.address && (
                <div className="flex items-start gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined mt-1">location_on</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold mb-1">Address</p>
                    <p>{hotel.address}</p>
                  </div>
                </div>
              )}
            </article>

            {/* Amenities Section */}
            <section className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-secondary mb-3 block">World-Class Amenities</span>
                <h3 className="text-2xl font-serif font-bold">Uncompromising Comfort</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: 'pool', label: 'Infinity Pool' },
                  { icon: 'spa', label: 'Royal Spa' },
                  { icon: 'restaurant', label: 'Michelin Dining' },
                  { icon: 'fitness_center', label: 'Gym' },
                  { icon: 'wifi', label: 'Fiber Connect' },
                  { icon: 'local_bar', label: 'Rooftop Bar' },
                  { icon: 'concierge', label: '24/7 Concierge' },
                  { icon: 'directions_car', label: 'Car Service' }
                ].map((amenity) => (
                  <div key={amenity.label} className="flex flex-col items-center text-center space-y-3">
                    <span className="material-symbols-outlined text-secondary text-3xl">{amenity.icon}</span>
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="space-y-8 bg-surface_container-low rounded-lg p-12" style={{ backgroundColor: '#f0f4ff' }}>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest font-bold text-secondary mb-3 block">Guest Chronicles</span>
                  <h3 className="text-2xl font-serif font-bold">Guests' Reflections</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="text-lg font-bold">4.9</span>
                  <span className="text-sm text-on-surface-variant">(342 reviews)</span>
                </div>
              </div>
              <div className="space-y-8">
                {[
                  { name: 'Eleanor Dumont', review: '"The level of detail in service is simply unmatched. From personalized scents to sunset champagne on the private pier, pure magic."' },
                  { name: 'Marcus Wainwright', review: '"A masterclass in luxury. The spa treatments were life-changing and the breakfast terrace view is worth the stay alone."' }
                ].map((guest) => (
                  <div key={guest.name} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold">{guest.name}</h4>
                      <div className="flex text-secondary gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="italic text-on-surface-variant leading-relaxed">{guest.review}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Booking Panel (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Price Header */}
              <div className="space-y-2 pb-8 border-b border-outline-variant/20">
                <span className="text-xs uppercase tracking-widest font-bold text-secondary">Premium Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-serif font-bold text-primary">₹{priceINR.toLocaleString('en-IN')}</span>
                  <span className="text-on-surface-variant">per night</span>
                </div>
              </div>

              {/* Booking Form */}
              {!user ? (
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-bold tracking-widest uppercase text-sm hover:opacity-90 transition-opacity"
                >
                  Sign In to Book
                </button>
              ) : (
                <form onSubmit={handleBook} className="space-y-6">
                  {/* Check-In */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant block">Check-In</label>
                    <input 
                      type="date"
                      value={form.checkIn.split('T')[0] || ''}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm({ ...form, checkIn: e.target.value })}
                      className="w-full bg-surface-container rounded px-4 py-3 border-b-2 border-outline-variant focus:border-secondary outline-none transition-colors"
                      required 
                    />
                  </div>

                  {/* Check-Out */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant block">Check-Out</label>
                    <input 
                      type="date"
                      value={form.checkOut.split('T')[0] || ''}
                      min={form.checkIn || new Date().toISOString().split('T')[0]}
                      onChange={e => setForm({ ...form, checkOut: e.target.value })}
                      className="w-full bg-surface-container rounded px-4 py-3 border-b-2 border-outline-variant focus:border-secondary outline-none transition-colors"
                      required 
                    />
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant block">Guests</label>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-high"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center">{adults} Adults</span>
                      <button 
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-high"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Room Type */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-on-surface-variant block">Suite Type</label>
                    <select 
                      value={roomType}
                      onChange={e => setRoomType(e.target.value)}
                      className="w-full bg-surface-container rounded px-4 py-3 border-b-2 border-outline-variant focus:border-secondary outline-none transition-colors"
                    >
                      <option value="DELUXE">Deluxe Sea View Suite</option>
                      <option value="HERITAGE">Heritage King Suite</option>
                      <option value="PENTHOUSE">Penthouse Residence</option>
                    </select>
                  </div>

                  {/* Availability Info */}
                  {form.checkIn && form.checkOut && (
                    <div className={`p-4 rounded-lg text-sm ${
                      availabilityInfo?.isAvailable 
                        ? 'bg-success/20 text-success-fixed border border-success/30' 
                        : 'bg-error/20 text-error-fixed border border-error/30'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          {availabilityInfo?.isAvailable ? 'check_circle' : 'block'}
                        </span>
                        <div>
                          <p className="font-bold">
                            {checkingAvail ? 'Checking availability...' : availabilityInfo?.message}
                          </p>
                          {availabilityInfo?.isAvailable && (
                            <p className="text-xs opacity-90 mt-1">
                              {availabilityInfo.nights} night(s) × ₹{priceINR.toLocaleString('en-IN')}/night = ₹{(priceINR * availabilityInfo.nights).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={!availabilityInfo?.isAvailable || checkingAvail}
                    className={`w-full py-4 px-6 rounded-lg font-bold tracking-widest uppercase text-sm transition-opacity mt-8 ${
                      availabilityInfo?.isAvailable && !checkingAvail
                        ? 'bg-secondary-fixed text-on-secondary-fixed hover:opacity-90'
                        : 'bg-outline text-on-surface-variant cursor-not-allowed opacity-50'
                    }`}
                  >
                    {checkingAvail ? 'Checking...' : 'Confirm Reservation'}
                  </button>
                </form>
              )}

              {/* Trust Badge */}
              <div className="flex items-start gap-3 p-4 rounded-lg" style={{ backgroundColor: '#f0f4ff' }}>
                <span className="material-symbols-outlined text-secondary text-2xl flex-shrink-0">verified_user</span>
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Best Price Guaranteed</p>
                  <p className="text-on-surface-variant">Secure SSL encrypted booking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
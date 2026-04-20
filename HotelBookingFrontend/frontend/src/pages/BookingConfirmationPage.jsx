import { useLocation, useNavigate } from 'react-router-dom';
import { getHotelImage } from '../utils/hotelImages';
import Footer from '../components/Footer';

export default function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    hotel, 
    bookingId = 'LX-889210-ZP',
    form, 
    adults,
    roomType, 
    nights, 
    finalTotal,
    guestName = 'Julian Alexander'
  } = location.state || {};

  if (!hotel) {
    navigate('/hotels');
    return null;
  }

  const checkInDate = new Date(form.checkIn);
  const checkOutDate = new Date(form.checkOut);
  const checkInFormatted = checkInDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const checkOutFormatted = checkOutDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="min-h-[calc(100vh-300px)] py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          
          {/* Success Checkmark */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-fixed text-on-secondary-fixed mb-8 shadow-xl" style={{ boxShadow: '0 48px 48px -12px rgba(1, 29, 53, 0.06)' }}>
              <span 
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            
            {/* Main Message */}
            <p className="text-xs uppercase tracking-widest text-secondary font-semibold mb-3">Your journey begins here</p>
            <h1 className="font-serif text-5xl md:text-6xl text-on-surface tracking-tight mb-6 leading-tight">Booking Confirmed!</h1>
            
            {/* Reservation ID Badge */}
            <div className="inline-block py-2 px-6 rounded-full bg-surface-container-high border border-outline-variant/20">
              <span className="text-on-surface-variant text-sm font-medium tracking-wide">RESERVATION ID: </span>
              <span className="text-on-surface font-bold tracking-widest ml-1">{bookingId}</span>
            </div>
          </div>

          {/* Summary Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xl text-left mb-10" style={{ boxShadow: '0 48px 48px -12px rgba(1, 29, 53, 0.06)' }}>
            <div className="grid grid-cols-1 md:grid-cols-5">
              
              {/* Featured Image */}
              <div className="md:col-span-2 relative h-64 md:h-auto overflow-hidden">
                <img 
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  src={getHotelImage(hotel, { width: 900, height: 600 })}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-serif text-2xl font-bold">{hotel.name}</h3>
                  <p className="text-sm opacity-90">{hotel.city}</p>
                </div>
              </div>

              {/* Details Section */}
              <div className="md:col-span-3 p-8 flex flex-col justify-between">
                <div className="space-y-6">
                  
                  {/* Check-in/Check-out */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Check-In</p>
                      <p className="text-lg font-semibold text-on-surface">{checkInFormatted}</p>
                      <p className="text-xs text-on-surface-variant">From 3:00 PM</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Check-Out</p>
                      <p className="text-lg font-semibold text-on-surface">{checkOutFormatted}</p>
                      <p className="text-xs text-on-surface-variant">Until 11:00 AM</p>
                    </div>
                  </div>

                  <div className="h-px bg-outline-variant/20 w-full" />

                  {/* Room & Guest */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Room Type</p>
                      <p className="text-sm font-medium text-on-surface">{roomType}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Guest Name</p>
                      <p className="text-sm font-medium text-on-surface">{guestName}</p>
                    </div>
                  </div>
                </div>

                {/* Payment & Total */}
                <div className="mt-8 pt-6 border-t border-outline-variant/10 flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Payment Status</p>
                    <p className="text-xs font-bold text-secondary italic mt-1">Guaranteed by Credit Card</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif font-bold text-on-surface">${finalTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/bookings')}
              className="bg-primary text-on-primary px-10 py-4 font-semibold text-sm uppercase tracking-wider rounded-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-xl"
              style={{ boxShadow: '0 48px 48px -12px rgba(1, 29, 53, 0.06)' }}
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/hotels')}
              className="bg-transparent border border-outline-variant text-on-surface px-10 py-4 font-semibold text-sm uppercase tracking-wider rounded-lg transition-all hover:bg-surface-container hover:border-on-surface-variant active:scale-95"
            >
              Back to Home
            </button>
          </div>

          {/* Email Confirmation */}
          <div className="mt-12 flex items-center gap-3 bg-surface-container-low py-3 px-6 rounded-full">
            <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              mail
            </span>
            <p className="text-sm text-on-surface-variant italic">A confirmation email has been sent to your registered email address.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

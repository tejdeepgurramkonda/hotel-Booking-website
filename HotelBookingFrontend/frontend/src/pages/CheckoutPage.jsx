import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking, checkAvailability } from '../api';
import toast from 'react-hot-toast';
import { getHotelImage } from '../utils/hotelImages';
import Footer from '../components/Footer';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, form, adults, children, roomType, nights, priceINR, totalAmount } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardForm, setCardForm] = useState({
    cardholderName: 'Julianne Moore',
    cardNumber: '0000 0000 0000 0000',
    expiryDate: 'MM / YY',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [availabilityWarning, setAvailabilityWarning] = useState(null);

  // Re-verify availability on page load
  useEffect(() => {
    const verifyAvailability = async () => {
      if (!hotel || !form || !roomType) return;

      try {
        const checkInDate = new Date(form.checkIn);
        const checkOutDate = new Date(form.checkOut);
        
        const isAvailable = await checkAvailability(hotel.id, roomType, checkInDate, checkOutDate);
        
        if (!isAvailable) {
          setAvailabilityWarning('⚠️ Selected room type may no longer be available. Please go back to select different dates or room type.');
        }
      } catch (err) {
        console.error('Availability verification failed:', err);
      }
    };

    verifyAvailability();
  }, [hotel, form, roomType]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-on-surface text-lg">Booking details not found. Redirecting...</p>
      </div>
    );
  }

  const checkInDate = new Date(form.checkIn);
  const checkOutDate = new Date(form.checkOut);
  const checkInFormatted = checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const checkOutFormatted = checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Calculate pricing breakdown
  const baseTotal = priceINR * nights;
  const taxes = Math.round(baseTotal * 0.08 * 100) / 100;
  const discount = Math.round(totalAmount * 0.055 * 100) / 100;
  const finalTotal = baseTotal + taxes - discount;

  const handlePayment = async (e) => {
    e.preventDefault();

    setProcessing(true);
    try {
      // Validate hotel data exists
      if (!hotel || !hotel.id) {
        toast.error('Hotel information is missing');
        setProcessing(false);
        return;
      }

      // Get user info from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user) {
        toast.error('User not authenticated. Please login again.');
        setProcessing(false);
        return;
      }

      // Re-verify availability before finalizing booking
      try {
        const checkInDate = new Date(form.checkIn);
        const checkOutDate = new Date(form.checkOut);
        const isStillAvailable = await checkAvailability(hotel.id, roomType, checkInDate, checkOutDate);
        
        if (!isStillAvailable) {
          toast.error('Room is no longer available for selected dates. Please select different dates.');
          setAvailabilityWarning('Room unavailable. Please select new dates.');
          setProcessing(false);
          return;
        }
      } catch (err) {
        console.warn('Could not verify availability before booking:', err);
        // Continue anyway - let backend validation handle it
      }

      // Create booking with backend-expected fields
      const bookingData = {
        hotelId: parseInt(hotel.id, 10),
        checkIn: form.checkIn.includes('T') ? form.checkIn.split('Z')[0] : `${form.checkIn}T00:00:00`,
        checkOut: form.checkOut.includes('T') ? form.checkOut.split('Z')[0] : `${form.checkOut}T00:00:00`,
        price: finalTotal,
        roomType: roomType // Include room type in booking
      };

      console.log('😀 Sending Booking Data:', bookingData);
      console.log('👤 User ID:', user.userId);
      console.log('🔐 User Role:', user.role);
      console.log('🏨 Hotel ID (type):', typeof bookingData.hotelId, bookingData.hotelId);

      const response = await createBooking(bookingData);
      console.log('✅ Booking Response:', response.data);
      
      toast.success('Booking confirmed successfully!');
      
      // Use booking ID from response if available, otherwise generate mock
      const bookingId = response.data?.id 
        ? 'LX-' + response.data.id.toString().padStart(6, '0') + '-ZP'
        : 'LX-' + Math.random().toString(36).substring(2, 8).toUpperCase().padStart(6, '0') + '-ZP';
      
      navigate('/booking-confirmation', {
        state: {
          hotel,
          form,
          adults,
          children,
          roomType,
          nights,
          finalTotal,
          guestName: cardForm.cardholderName || user.username || 'Guest',
          bookingId
        }
      });
    } catch (error) {
      console.error('❌ Booking Error:', error);
      console.error('📝 Error Response:', error.response?.data);
      console.error('🔴 Error Status:', error.response?.status);
      
      const errorMsg = error.response?.data?.message 
        || error.message 
        || 'Payment failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
        {/* Editorial Header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-secondary mb-3 block">Secure Checkout</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary tracking-tight">Finalize Reservation</h1>
        </div>

        {/* Availability Warning */}
        {availabilityWarning && (
          <div className="mb-6 p-4 bg-error/20 border border-error/30 rounded-lg text-error-fixed text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              <div>
                <p className="font-bold">Availability Alert</p>
                <p className="mt-1">{availabilityWarning}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Payment Method Tabs */}
            <div className="flex gap-2 bg-surface-container-lowest p-1 rounded-lg mb-8">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Credit/Debit Card
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                UPI / Net Banking
              </button>
            </div>

            {/* Card Form */}
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1 block">Cardholder Name</label>
                <input
                  type="text"
                  value={cardForm.cardholderName}
                  onChange={(e) => setCardForm({ ...cardForm, cardholderName: e.target.value })}
                  placeholder="e.g. Julianne Moore"
                  className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-lg py-4 px-5 text-on-surface placeholder:text-outline/60 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1 block">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-lg py-4 px-5 text-on-surface placeholder:text-outline/60 transition-all outline-none"
                  />
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    credit_card
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant ml-1 block">Expiry Date</label>
                  <input
                    type="text"
                    value={cardForm.expiryDate}
                    onChange={(e) => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                    placeholder="MM / YY"
                    className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-lg py-4 px-5 text-on-surface placeholder:text-outline/60 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-on-surface-variant ml-1 block">CVV</label>
                  <input
                    type="password"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    placeholder="•••"
                    maxLength="4"
                    className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-lg py-4 px-5 text-on-surface placeholder:text-outline/60 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-sm">Secure Payment Guarantee</h4>
                  <p className="text-xs text-on-surface-variant">Your transaction is encrypted with bank-grade 256-bit SSL security protocol.</p>
                </div>
              </div>

              {/* Hidden submit button only for form submission, actual CTA is below */}
              <input type="submit" hidden />
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-primary-container text-on-primary rounded-2xl overflow-hidden shadow-2xl sticky top-24">
              {/* Image Section */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={getHotelImage(hotel, { width: 900, height: 600 })}
                  alt={hotel.name}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-container" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] uppercase tracking-widest text-secondary-fixed mb-1 block font-bold">Reservation Summary</span>
                  <h3 className="font-serif text-2xl text-white font-bold leading-tight">{hotel.name}</h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 space-y-6">
                
                {/* Stay Duration */}
                <div className="flex justify-between items-start pb-6 border-b border-on-primary-container/10">
                  <div>
                    <p className="text-xs text-on-primary-container/60 mb-1 uppercase tracking-tighter font-medium">Stay Duration</p>
                    <p className="text-white font-medium">{checkInFormatted} — {checkOutFormatted}</p>
                    <p className="text-xs text-on-primary-container/40">{nights} Night{nights > 1 ? 's' : ''}, {adults} Adult{adults > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-primary-container/60 mb-1 uppercase tracking-tighter font-medium">Room Type</p>
                    <p className="text-white font-medium text-sm">{roomType}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-primary-container/70">Standard Rate ({nights} Night{nights > 1 ? 's' : ''})</span>
                    <span className="text-white">₹{baseTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-primary-container/70">Taxes & Editorial Surcharge</span>
                    <span className="text-white">₹{taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary-fixed font-medium">
                    <span>Luxe Member Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t border-on-primary-container/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-on-primary-container/50 uppercase tracking-widest font-medium mb-1">Total Amount</p>
                    <p className="text-4xl font-serif font-bold text-white">₹{finalTotal.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg flex flex-col items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-secondary-fixed text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="text-[10px] text-white/80 font-medium uppercase tracking-tighter text-center leading-tight">Best Price<br/>Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Sticky CTA Footer */}
        <div className="mt-16 pt-12 border-t border-outline-variant/20">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-secondary text-on-secondary-fixed py-5 px-6 rounded-lg font-bold text-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            {processing ? 'Processing...' : `Confirm & Pay ₹${finalTotal.toLocaleString('en-IN')}`}
          </button>
          <p className="text-center text-on-surface-variant text-xs mt-6 font-medium">
            By clicking Confirm & Pay, you agree to our{' '}
            <a href="#" className="text-secondary underline underline-offset-4 hover:opacity-80">Booking Policy</a>
            {' '}and{' '}
            <a href="#" className="text-secondary underline underline-offset-4 hover:opacity-80">Terms of Service</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

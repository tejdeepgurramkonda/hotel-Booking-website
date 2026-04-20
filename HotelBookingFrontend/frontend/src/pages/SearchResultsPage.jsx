import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getHotelImage } from '../utils/hotelImages';
import Footer from '../components/Footer';

export default function SearchResultsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedStars, setSelectedStars] = useState({
    5: false,
    4: false,
    3: false,
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  // Fetch from backend with filters
  useEffect(() => {
    fetchHotels();
  }, [initialQuery, minPrice, maxPrice, selectedStars, sortBy]);

  async function fetchHotels() {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      
      if (initialQuery) params.append('city', initialQuery);
      params.append('minPrice', minPrice);
      params.append('maxPrice', maxPrice);
      
      // Calculate min/max rating based on selected stars
      const activeStars = Object.keys(selectedStars).filter(star => selectedStars[star]);
      if (activeStars.includes('5')) {
        params.append('minRating', 4.7);
      } else if (activeStars.includes('4')) {
        params.append('minRating', 4.0);
      }
      
      let sortParam = 'popularity';
      if (sortBy === 'Price: Low to High') sortParam = 'price_asc';
      else if (sortBy === 'Price: High to Low') sortParam = 'price_desc';
      else if (sortBy === 'Rating') sortParam = 'rating_desc';
      params.append('sortBy', sortParam);
      
      const res = await fetch(`http://localhost:8081/hotel?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load hotels');
      
      const data = await res.json();
      setHotels(data);
    } catch {
      toast.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  }

  const handleStarChange = (star) => {
    setSelectedStars(prev => ({ ...prev, [star]: !prev[star] }));
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-slate-900 pb-20">
      {/* Header Section */}
      <div className="max-w-screen-2xl mx-auto px-8 pt-12 pb-8 border-b border-slate-200">
        <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-2">
          Curated Collections
        </span>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-4 font-headline">
          {initialQuery ? `Search: ${initialQuery}` : 'Parisian Sanctuaries'}
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <p className="text-slate-600 font-medium">
            {hotels.length} exclusive properties found {initialQuery && `matching "${initialQuery}"`}
          </p>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Sort By</span>
            <select 
              className="bg-transparent border-none font-semibold text-slate-900 focus:ring-0 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-20 shadow-sm">
              <h3 className="font-bold text-lg mb-6">Filters</h3>

              {/* Star Rating */}
              <div className="mb-8">
                <h4 className="font-semibold text-sm mb-4">Star Rating</h4>
                <div className="space-y-3">
                  {[5, 4, 3].map(star => (
                    <label key={star} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStars[star]}
                        onChange={() => handleStarChange(star)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(star)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-xs text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        <span className="text-sm text-slate-600 ml-2">{star} star{star > 1 ? 's' : ''}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-sm mb-4">Price Range (₹)</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    ₹{minPrice.toLocaleString('en-IN')} — ₹{maxPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedStars({ 5: false, 4: false, 3: false });
                  setMinPrice(0);
                  setMaxPrice(50000);
                  setSortBy('popularity');
                }}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded font-medium text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main Content - Hotel Listings */}
          <div className="md:col-span-3">
            {loading && (
              <div className="text-center py-12">
                <p className="text-slate-600">Loading properties...</p>
              </div>
            )}

            {!loading && hotels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">No hotels found matching your criteria.</p>
              </div>
            )}

            {!loading && hotels.length > 0 && (
              <div className="grid grid-cols-1 gap-8">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/hotels/${hotel.id}`)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* Image */}
                      <div className="md:col-span-1 h-64 md:h-auto overflow-hidden">
                        <img
                          src={getHotelImage(hotel, { width: 400, height: 400 })}
                          alt={hotel.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2 p-6 flex flex-col justify-between">
                        <div>
                          {/* Title */}
                          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{hotel.name}</h3>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-slate-600 mb-4">
                            <span className="material-symbols-outlined text-lg">location_on</span>
                            <span>{hotel.city}, {hotel.state}</span>
                          </div>

                          {/* Description */}
                          <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-2">
                            {hotel.description || 'A luxurious hotel experience awaits.'}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i < Math.floor(hotel.rating || 0) ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                              ))}
                            </div>
                            <span className="font-semibold text-slate-900">{(hotel.rating || 0).toFixed(1)}</span>
                            <span className="text-sm text-slate-600">(Excellent)</span>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {['Free WiFi', 'Swimming Pool', 'Spa'].map((amenity) => (
                              <span key={amenity} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Footer - Price */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">Starting at</p>
                            <p className="text-2xl font-serif font-bold text-slate-900">
                              ₹{(hotel.price || 0).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-slate-600">per night</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/hotels/${hotel.id}`);
                            }}
                            className="px-6 py-3 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

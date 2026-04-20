import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  function handleLogout() {
    logoutUser();
    navigate('/login');
  }

  function handleSearch(e) {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }

  const getLinkClass = (path) => {
    const isActive = pathname === path || (path === '/' && pathname === '/hotels');
    return isActive
      ? "text-amber-700 dark:text-amber-500 font-semibold border-b-2 border-amber-700 dark:border-amber-500 pb-1 hover:opacity-80 transition-opacity duration-300"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:opacity-80 transition-opacity duration-300";
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center h-20 px-8 max-w-screen-2xl mx-auto">
        <div className="flex-1 flex justify-start">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">
            LUXE
          </Link>
        </div>
        <div className="hidden md:flex justify-center items-center space-x-12 whitespace-nowrap px-8">
          {user && (
            <>
              <Link to="/hotels" className={getLinkClass('/hotels')}>Hotels</Link>
              <Link to="/bookings" className={getLinkClass('/bookings')}>Bookings</Link>
              <Link to="/profile" className={getLinkClass('/profile')}>Profile</Link>
              {user?.role === 'ADMIN' && <Link to="/admin" className={getLinkClass('/admin')}>Admin</Link>}
            </>
          )}
        </div>
        <div className="flex-1 flex items-center justify-end space-x-6 ml-8">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-800 focus-within:border-amber-700/50 focus-within:ring-2 focus-within:ring-amber-700/20 transition-all">
            <span className="material-symbols-outlined text-[18px] text-slate-400 mr-2">search</span>
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-48 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 p-0"
            />
          </form>
          {user ? (
            <>
              <span className="text-slate-600 dark:text-slate-400 font-medium">{user.email}</span>
              <button onClick={handleLogout} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-all duration-200 active:scale-95">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-all duration-200 active:scale-95">Login</Link>
              <Link to="/register" className="bg-primary text-on-primary px-6 py-2.5 rounded hover:opacity-90 transition-all duration-200 active:scale-95 font-medium">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

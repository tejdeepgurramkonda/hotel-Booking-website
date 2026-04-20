import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    if(e) e.preventDefault();
    try {
      setLoading(true);
      const res = await login({ email, password });
      loginUser(res.data);
      toast.success('Logged in successfully!');
      navigate('/hotels');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-6 relative overflow-hidden bg-surface">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-surface-container-high rounded-full blur-[120px] opacity-40 -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-secondary-container rounded-full blur-[120px] opacity-20 -z-10"></div>
      
      {/* Decorative Images */}
      <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 rotate-[-5deg] shadow-2xl rounded-2xl overflow-hidden z-0">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbAHJ5IIbpoDSftGe_BvkAzPscMAtCNmoBqN1HCRZ4bbFOjcHp0FdMdDRJHFghE8ZHIUXudmVY9TGRKQFwXNn4XpaoEtJ4FQVP_x5WU1bUe3krdXrUTFWKIVZTVvV96O8oMLa8-ILCXRTyS9Bo8rLKRhQQH794sU_LggK2BlpRD0dvxBqKFXSJDx4WfUtw_WaJaQFyHKhw94lIXfHtIcARsE5zH432RgxsiJbMPZvsQbNFvIXa0pB59edtclj3eRuMinPuRa3GmvVQ" className="w-64 h-80 object-cover" alt="Decorative" />
      </div>
      <div className="hidden lg:block absolute right-10 top-1/4 rotate-[8deg] shadow-2xl rounded-2xl overflow-hidden z-0">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwEZwDXKq-de1hzI5KIAMBacTMJCyZPTEb5mM6iVWEPWt4Oi2XRDnl0ED72PmUwLYkzXVZT2WpbAprZxAN7vfcZLrOL-Pq-Vvl-QzBG0LZJP560J0m_Tk3NQJw-23ZnuwzXs1w_8xt4KHrhGX-C2tMeJHPE8Jnsv2SH-aP64r9fVaOsggqRFpcLlPKPjmhup3Z5B374q5PJzpmyNjTy4rDwr21JG1nuf_DXWhpd7-iLIiv8uSsbfI19Pu_IvBKtAYJ-QQCeQmH3HME" className="w-56 h-72 object-cover" alt="Decorative" />
      </div>

      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_48px_48px_-12px_rgba(1,29,53,0.06)] relative z-10">
        <div className="text-center mb-10">
          <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-semibold mb-3 block">Welcome Back</span>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2">Member Login</h1>
          <p className="text-on-surface-variant text-sm font-light">Enter your credentials to access your private concierge.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="email" className="font-label text-xs font-semibold text-on-surface-variant ml-1">Email Address</label>
            <input 
              id="email" 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@domain.com" 
              className="w-full bg-surface-container-low border border-transparent focus:border-secondary focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-4 text-on-surface placeholder:text-outline/50 transition-all duration-300" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" className="font-label text-xs font-semibold text-on-surface-variant">Password</label>
              <a href="#" className="text-[11px] font-medium text-secondary hover:text-on-secondary-container transition-colors">Forgot Password?</a>
            </div>
            <input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-surface-container-low border border-transparent focus:border-secondary focus:ring-1 focus:ring-secondary/30 rounded-lg px-4 py-4 text-on-surface placeholder:text-outline/50 transition-all duration-300" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-4 rounded-lg font-semibold tracking-wide hover:opacity-90 transition-all duration-300 flex items-center justify-center group disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <span className="material-symbols-outlined ml-2 text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </button>
        </form>

        <div className="relative my-10 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/30"></div>
          </div>
          <span className="relative px-4 bg-surface-container-lowest text-[10px] font-bold text-outline uppercase tracking-widest">Or continue with</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <a href="http://localhost:8081/auth/oauth2/authorization/google" className="flex items-center justify-center space-x-3 bg-surface border border-outline-variant/20 py-3.5 rounded-lg hover:bg-surface-container-high transition-colors duration-300">
            <img src="https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-internet-icon-vector-png-image_9183287.png" alt="Google" className="w-5 h-5" />
            <span className="font-label text-xs font-semibold text-on-surface">Google</span>
          </a>
          <a href="http://localhost:8081/auth/oauth2/authorization/github" className="flex items-center justify-center space-x-3 bg-primary text-on-primary py-3.5 rounded-lg hover:opacity-90 transition-all duration-300">
            <svg height="20" width="20" viewBox="0 0 16 16" version="1.1" aria-hidden="true" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            <span className="font-label text-xs font-semibold">GitHub</span>     
          </a>
        </div>

        <p className="text-center text-xs font-medium text-on-surface-variant font-label">
          Don't have an account?{' '}
          <Link to="/register" className="text-on-surface font-bold hover:text-secondary transition-colors underline decoration-2 underline-offset-4">Register Now</Link>
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
}


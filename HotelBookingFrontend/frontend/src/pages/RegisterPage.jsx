import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    if(e) e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    try {
      setLoading(true);
      await register({ email, password });
      toast.success('Registration successful. Please log in.');
      navigate('/login');
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="flex-grow flex items-center justify-center py-20 px-4 relative overflow-hidden bg-surface min-h-[calc(100vh-80px)]">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-secondary-fixed rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary-fixed rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-2xl z-10">
        <div className="bg-surface-container-lowest shadow-[0_48px_48px_-12px_rgba(1,29,53,0.06)] rounded-lg overflow-hidden flex flex-col md:flex-row">
          
          <div className="md:w-5/12 relative hidden md:block">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7u4zl1vb_p8nYqBL07N9ym-xnDV_BJ2eMK2pl1ywGEzJDGSQKBcg8XfKwttbRChj9FIEq07G4v-hgor5BcrA3_F7nOB1qyPsQoUai96ksSovoLMotI43uaV-XrGQmVOd-Pst1UT2142LElNEoqbpW2CddbmcA4COy4i_Puf2gtEMysvV7a0sl-cPJsfVXtEJD8QrTAASWA7jgBIxiY03y7yjWnRIa9FCxBt4ESNrzYQBSmJ6fRuO12ncwUc0cwnPIN68mqcQBILjZ" alt="Decorative Sidebar" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex flex-col justify-end p-8 text-white">
              <span className="text-xs font-label uppercase tracking-widest mb-2 text-secondary-fixed">Join the Elite</span>
              <h2 className="font-headline text-3xl leading-tight mb-4">Start Your Bespoke Journey</h2>
              <p className="text-sm font-body text-slate-200 opacity-90 leading-relaxed">Access exclusive editorial content and curated travel experiences found nowhere else.</p>
            </div>
          </div>
          
          <div className="w-full md:w-7/12 p-8 md:p-12">
            <div className="mb-10">
              <span className="block font-label text-[10px] uppercase tracking-[0.2em] text-secondary mb-1">Membership</span>
              <h1 className="font-headline text-3xl text-on-surface tracking-tight">Create Account</h1>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="relative">
                <label htmlFor="fullname" className="block font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  id="fullname" 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Julianne Moore" 
                  className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded py-3 px-4 text-on-surface placeholder:text-outline-variant font-body text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="email" className="block font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    id="email" 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="julianne@luxe.com"
                    className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded py-3 px-4 text-on-surface placeholder:text-outline-variant font-body text-sm transition-all"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="phone" className="block font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    id="phone" 
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-00"
                    className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded py-3 px-4 text-on-surface placeholder:text-outline-variant font-body text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="password" className="block font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Password</label>
                  <input 
                    id="password" 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded py-3 px-4 text-on-surface placeholder:text-outline-variant font-body text-sm transition-all"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="confirm_password" className="block font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Confirm Password</label>
                  <input 
                    id="confirm_password" 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-secondary/30 rounded py-3 px-4 text-on-surface placeholder:text-outline-variant font-body text-sm transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-on-primary py-4 rounded font-semibold tracking-wide hover:opacity-90 transition-colors flex justify-center items-center group disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                  {!loading && <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                </button>
              </div>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>   
              </div>
              <span className="relative px-4 bg-surface text-[10px] font-bold text-outline uppercase tracking-widest">Or sign up with</span>      
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
              <a href="http://localhost:8081/auth/oauth2/authorization/google" className="flex items-center justify-center space-x-3 bg-surface border border-outline-variant/20 py-3.5 rounded hover:bg-surface-container-high transition-colors duration-300">
                <img src="https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-internet-icon-vector-png-image_9183287.png" alt="Google" className="w-5 h-5" />
                <span className="font-label text-xs font-semibold text-on-surface">Google</span>
              </a>
              <a href="http://localhost:8081/auth/oauth2/authorization/github" className="flex items-center justify-center space-x-3 bg-primary text-on-primary py-3.5 rounded hover:opacity-90 transition-all duration-300">
                <svg height="20" width="20" viewBox="0 0 16 16" version="1.1" aria-hidden="true" fill="currentColor"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                <span className="font-label text-xs font-semibold">GitHub</span>     
              </a>
            </div>

            <div className="mt-8 text-center border-t border-outline-variant/20 pt-8">
              <p className="text-xs font-medium text-on-surface-variant font-label">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary font-bold hover:text-secondary-fixed transition-colors">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

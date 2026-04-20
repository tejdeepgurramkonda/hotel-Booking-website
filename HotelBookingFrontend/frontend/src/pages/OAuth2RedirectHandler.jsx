import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const role = searchParams.get('role');

    // To prevent loops, check if we already redirected
    if (!token) {
      if (searchParams.get('error')) {
         toast.error('OAuth2 login failed. ' + searchParams.get('error'));
         navigate('/login');
      }
      return;
    }

    if (token && userId && email) {
      // Clear search params to prevent effect re-triggering while navigating
      navigate('/', { replace: true });
      
      // Simulate the backend response format expected by loginUser
      loginUser({
        token,
        userId: parseInt(userId, 10),
        email,
        role: role || 'USER'
      });
      toast.success('Successfully logged in with OAuth2!');
      
    } else {
      toast.error('OAuth2 login failed. Missing required parameters.');
      navigate('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <h2>Logging you in...</h2>
    </div>
  );
}

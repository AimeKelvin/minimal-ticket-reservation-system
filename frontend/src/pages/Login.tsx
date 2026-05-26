import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email,
        password
      });
      const loggedInUser = res.data?.data?.user;
      login(loggedInUser);
      toast.success('Welcome back!');
      if (loggedInUser.role === 'fleetmanager') {
        navigate('/fleet');
      } else {
        navigate(from, {
          replace: true
        });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to log in. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-12 group w-fit">
            <div className="bg-secondary text-accent p-1.5 rounded-lg group-hover:bg-secondary-hover transition-colors">
              <Bus size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink">
              SwiftWheels
            </span>
          </Link>

          <h2 className="text-3xl font-bold tracking-tight text-ink mb-2">
            Welcome back
          </h2>
          <p className="text-ink-muted mb-8">
            Enter your details to access your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error &&
            <div className="p-3 text-sm text-danger bg-danger-soft border border-danger/20 rounded-xl">
                {error}
              </div>
            }

            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              leftIcon={<Mail size={18} />} />
            

            <div>
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />} />
              
              <div className="flex justify-end mt-2">
                <a
                  href="#"
                  className="text-sm font-medium text-accent hover:text-accent-hover">
                  
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}>
              
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-accent hover:text-accent-hover">
              
              Sign up
            </Link>
          </p>

          <div className="mt-8 p-4 bg-canvas border border-border rounded-xl text-xs text-ink-muted">
            <p className="font-semibold mb-1 text-ink">Demo Credentials:</p>
            <p>Customer: customer@swiftwheels.com / Customer@12345</p>
            <p>Fleet: manager@swiftwheels.com / Manager@12345</p>
          </div>
        </div>
      </div>

      {/* Right side - Accent Panel */}
      <div className="hidden lg:flex flex-1 bg-secondary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse">
                
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1" />
                
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-md text-center px-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Bus size={40} className="text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Premium travel, simplified.
          </h3>
          <p className="text-accent-soft text-lg">
            Manage your bookings, track your journeys, and travel with
            confidence across Rwanda.
          </p>
        </div>
      </div>
    </div>);

}
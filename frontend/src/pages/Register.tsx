import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
export function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', {
        fullname,
        email,
        phone,
        password,
        role: 'customer'
      });
      const createdUser = res.data?.data?.user;
      login(createdUser);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to create account. Please try again.'
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
            Create an account
          </h2>
          <p className="text-ink-muted mb-8">
            Join SwiftWheels to book and manage your trips.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error &&
            <div className="p-3 text-sm text-danger bg-danger-soft border border-danger/20 rounded-xl">
                {error}
              </div>
            }

            <Input
              label="Full Name"
              type="text"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="John Doe"
              leftIcon={<User size={18} />} />
            

            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              leftIcon={<Mail size={18} />} />
            

            <Input
              label="Phone Number"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0780000000"
              leftIcon={<Phone size={18} />} />
            

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              leftIcon={<Lock size={18} />} />
            

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}>
              
              Create account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-accent hover:text-accent-hover">
              
              Sign in
            </Link>
          </p>
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
            Join thousands of travelers.
          </h3>
          <p className="text-accent-soft text-lg">
            Experience the most reliable and comfortable way to travel across
            Rwanda.
          </p>
        </div>
      </div>
    </div>);

}
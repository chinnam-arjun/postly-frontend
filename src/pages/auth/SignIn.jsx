import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginThunk } from '../../redux_thunks/authThunk';
import toast from 'react-hot-toast';
import { Loader2, Mail, Lock } from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { isLoading, token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user) {
      navigate('/');
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const resultAction = await dispatch(loginThunk(formData));
      if (loginThunk.fulfilled.match(resultAction)) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(resultAction.error.message || 'Login failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--color-background)' }}>
      <div className="ui-card max-w-md w-full space-y-8 p-8 sm:p-10">
        <div>
          <div className="mx-auto w-fit text-2xl font-bold tracking-wide" style={{ color: 'var(--color-primary)' }}>POSTLY</div>
          <h2 className="mt-5 text-center text-3xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Or{' '}
            <Link to="/signup" className="font-medium" style={{ color: 'var(--color-primary)' }}>
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="ui-input pl-10"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="ui-input pl-10"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="ui-button ui-button-primary w-full"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

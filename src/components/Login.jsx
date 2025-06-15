'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';
import { useLoginMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [login] = useLoginMutation();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Simplified login flow - no nested promises
      const result = await login({
        email: formData.email.toLowerCase(),
        password: formData.password,
      }).unwrap();
      
      // Auth state is automatically updated by Redux through authSlice.js
      console.log('Login successful');
      
      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      // Handle different types of errors
      if (err.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(err.data?.message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Login</h1>
        
        {error && <div className={styles.authError}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.authInput}
              placeholder="Enter your email"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.authInput}
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className={styles.authButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className={styles.authLinks}>
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className={styles.authLink}>
              Sign up
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className={styles.authLink}>
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
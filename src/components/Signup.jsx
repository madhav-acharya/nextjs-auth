'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';
import { useSignupMutation, useLoginMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [signup] = useSignupMutation();
  const [login] = useLoginMutation(); // Added login to auto-login after signup
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
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

    // Validation
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Register the user
      const signupResult = await signup({
        fullName: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password,
      }).unwrap();
      
      // Display success message
      setRegistrationSuccess(true);
      
      // Step 2: Automatically log them in (Option 1)
      try {
        await login({
          email: formData.email.toLowerCase(),
          password: formData.password,
        }).unwrap();
        
        // Auth state is automatically updated by Redux
        // Redirect to home page after successful login
        router.push('/');
      } catch (loginErr) {
        // If auto-login fails, redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Wait 2 seconds so user can see success message
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.status === 409) {
        setError('Email already exists. Please use a different email.');
      } else {
        setError(err.data?.message || 'An error occurred during signup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Create Account</h1>
        
        {error && <div className={styles.authError}>{error}</div>}
        
        {registrationSuccess && (
          <div className={styles.authSuccess}>
            Account created successfully! Signing you in...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.authInput}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className={styles.authInput}
              placeholder="Enter your email"
              value={formData.email}
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
              minLength={6}
              className={styles.authInput}
              placeholder="Create a password"
            />
            <small className={styles.passwordHint}>Must be at least 6 characters</small>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.authInput}
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            className={styles.authButton}
            disabled={isLoading || registrationSuccess}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className={styles.authLinks}>
          <p>
            Already have an account?{' '}
            <Link href="/login" className={styles.authLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
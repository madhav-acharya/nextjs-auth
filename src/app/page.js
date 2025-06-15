'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomePage from '@/components/home';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { restoreUser } from '@/store/slices/authSlice';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);
  
  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      setUserId(user.id);
    } else if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);
  
  return userId ? <HomePage userId={userId} /> : null;
}
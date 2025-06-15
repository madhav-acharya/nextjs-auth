'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetUserProfileQuery, useLogoutMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import styles from '@/styles/home.module.css';

// Icon components (keep as they were)
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;

const HomePage = ({ userId }) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { data: user, error, isLoading } = useGetUserProfileQuery(userId);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate account age
  const getAccountAge = (dateString) => {
    if (!dateString) return 'N/A';
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears !== 1 ? 's' : ''}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}>Welcome to your Profile</h1>
          {isLoading ? (
            <div className={styles.userPlaceholder}>Loading...</div>
          ) : error ? (
            <div className={styles.errorBanner}>
              Error loading profile: {error.message || 'Please try again'}
            </div>
          ) : user ? (
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user?.user?.fullName ? user?.user?.fullName?.charAt(0)?.toUpperCase() : 'U'}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user?.user?.fullName}</span>
                <span className={styles.userEmail}>{user?.user?.email}</span>
              </div>
            </div>
          ) : (
            <div className={styles.userPlaceholder}>No user data</div>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your profile...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <h2>Unable to load profile</h2>
            <p>{error.message || 'Please check your connection and try again.'}</p>
            <button 
              onClick={() => router.refresh()}
              className={styles.button}
            >
              Retry
            </button>
          </div>
        ) : user ? (
          <>
            <div className={styles.profileSection}>
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <h2>Your Profile</h2>
                  <Link href="/profile/edit" className={styles.editButton}>
                    Edit Profile
                  </Link>
                </div>

                <div className={styles.profileBody}>
                  <div className={styles.profileAvatar}>
                    {user?.user?.fullName ? user?.user?.fullName?.charAt(0)?.toUpperCase() : 'U'}
                  </div>
                  
                  <div className={styles.profileFields}>
                    <div className={styles.profileField}>
                      <div className={styles.fieldIcon}>
                        <IconUser />
                      </div>
                      <div className={styles.fieldContent}>
                        <span className={styles.fieldLabel}>Full Name</span>
                        <span className={styles.fieldValue}>{user?.user?.fullName}</span>
                      </div>
                    </div>
                    
                    <div className={styles.profileField}>
                      <div className={styles.fieldIcon}>
                        <IconMail />
                      </div>
                      <div className={styles.fieldContent}>
                        <span className={styles.fieldLabel}>Email Address</span>
                        <span className={styles.fieldValue}>{user?.user?.email}</span>
                      </div>
                    </div>
                    
                    {user.createdAt && (
                      <div className={styles.profileField}>
                        <div className={styles.fieldIcon}>
                          <IconCalendar />
                        </div>
                        <div className={styles.fieldContent}>
                          <span className={styles.fieldLabel}>Member Since</span>
                          <span className={styles.fieldValue}>{formatDate(user?.user?.createdAt)}</span>
                          <span className={styles.fieldMeta}>{getAccountAge(user?.user?.createdAt)} with us</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.actionsCard}>
                <h3>Quick Actions</h3>
                <div className={styles.actionButtons}>
                  <Link href="/dashboard" className={styles.actionButton}>
                    <IconDashboard />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/profile/settings" className={styles.actionButton}>
                    <IconSettings />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleLogout} className={`${styles.actionButton} ${styles.logoutButton}`}>
                    <IconLogout />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.noDataContainer}>
            <h2>No user data available</h2>
            <p>Please log in to view your profile information.</p>
            <Link href="/login" className={styles.button}>
              Log In
            </Link>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
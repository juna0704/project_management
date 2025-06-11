'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StoreProvider, { useAppSelector } from './redux';

/**
 * DashboardLayout Component
 * Main layout component that provides the structure for dashboard pages
 * Handles sidebar collapse state and dark mode toggle functionality
 */

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // Get sidebar collapsed state from Redux store
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  // Get dark mode state from Redux store
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Effect to handle dark mode toggle by adding/removing 'dark' class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  return (
    // Main container
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Sidebar  */}
      <Sidebar />

      {/* Main content area that adjusts based on sidebar state */}
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? '' : 'md:pl-64'
        }`}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page content passed as children  */}
        {children}
      </main>
    </div>
  );
};

/**
 * DashboardWrapper Component
 * Wrapper component that provides Redux store to the entire dashboard
 * This ensures all child components have access to the global state
 */

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;

/**
 * TAILWIND CSS CLASSES BREAKDOWN:
 *
 * Main Container Classes:
 * - flex: Sets display to flexbox
 * - min-h-screen: Sets minimum height to 100vh (full viewport height)
 * - w-full: Sets width to 100%
 * - bg-gray-50: Sets background color to very light gray
 * - text-gray-900: Sets text color to very dark gray (almost black)
 *
 * Main Content Area Classes:
 * - flex: Sets display to flexbox
 * - w-full: Sets width to 100%
 * - flex-col: Sets flex direction to column (vertical stacking)
 * - bg-gray-50: Sets background color to very light gray
 * - dark:bg-dark-bg: Sets background to custom dark background in dark mode
 * - md:pl-64: Adds 16rem (256px) left padding on medium screens and up (when sidebar is visible)
 *
 * Conditional Classes:
 * - The md:pl-64 class is conditionally applied based on isSidebarCollapsed state
 * - When sidebar is collapsed, no left padding is applied
 * - When sidebar is expanded, left padding of 16rem is applied on medium+ screens
 */

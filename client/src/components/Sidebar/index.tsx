'use client';

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { useGetProjectsQuery } from '@/state/api';
import { signOut } from 'aws-amplify/auth';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

/**
 * Sidebar Component
 * Main navigation sidebar with collapsible sections for projects and priorities
 * Contains logo, team info, navigation links, and collapsible project/priority lists
 */

const Sidebar = () => {
  // Local state to control visibility of projects section
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  // Fetch projects data from API using RTK Query
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  // const { data: currentUser } = useGetAuthUserQuery({});
  // const handleSignOut = async () => {
  //   try {
  //     await signOut();
  //   } catch (error) {
  //     console.error('Error signing out: ', error);
  //   }
  // };
  // if (!currentUser) return null;
  // const currentUserDetails = currentUser?.userDetails;

  // Dynamic class names for sidebar container based on collapsed state
  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? 'w-0 hidden' : 'w-64'}
  `;

  return (
    // Main sidebar container
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO SECTION - Contains brand name and close button */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            EDLIST
          </div>
          {/* Conditional close button - only shows when sidebar is expanded */}
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              {/* Close (X) icon */}
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        {/* TEAM SECTION - Shows team logo, name, and privacy status */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          {/* Team logo/avatar */}
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          {/* Team info container */}
          <div>
            {/* Team name */}
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              EDROH TEAM
            </h3>
            {/* Privacy indicator */}
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* MAIN NAVIGATION LINKS */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        {/* PROJECTS SECTION TOGGLE BUTTON */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* DYNAMIC PROJECTS LIST - Only shows when showProjects is true */}
        {showProjects &&
          projects?.map((project) => (
            <SidebarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}

        {/* PRIORITIES SECTION TOGGLE BUTTON */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {/* STATIC PRIORITY LINKS - Only shows when showPriority is true */}
        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
      {/* <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails?.username}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div> */}
    </div>
  );
};

/**
 * SidebarLink Props Interface
 * Defines the structure for individual sidebar navigation links
 */

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

/**
 * SidebarLink Component
 * Individual navigation link with icon, label, and active state highlighting
 * Shows visual indicator when the current route matches the link
 */

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  // Get current pathname to determine active state
  const pathname = usePathname();
  // Determine if this link is currently active
  const isActive =
    pathname === href || (pathname === '/' && href === '/dashboard');

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? 'bg-gray-100 text-white dark:bg-gray-600' : ''
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;

/**
 * TAILWIND CSS CLASSES BREAKDOWN:
 *
 * Sidebar Container Classes (sidebarClassNames):
 * - fixed: Sets position to fixed (stays in place when scrolling)
 * - flex: Sets display to flexbox
 * - flex-col: Sets flex direction to column (vertical stacking)
 * - h-[100%]: Sets height to 100% (arbitrary value)
 * - justify-between: Distributes space between flex items
 * - shadow-xl: Adds extra large shadow (0 20px 25px -5px rgba(0,0,0,0.1))
 * - transition-all: Applies transition to all animatable properties
 * - duration-300: Sets transition duration to 300ms
 * - z-40: Sets z-index to 40 (high stacking order)
 * - dark:bg-black: Sets background to black in dark mode
 * - overflow-y-auto: Allows vertical scrolling when content overflows
 * - bg-white: Sets background color to white
 * - w-0: Sets width to 0 (when collapsed)
 * - hidden: Hides element completely (when collapsed)
 * - w-64: Sets width to 16rem/256px (when expanded)
 *
 * Content Wrapper Classes:
 * - flex: Sets display to flexbox
 * - h-[100%]: Sets height to 100% (arbitrary value)
 * - w-full: Sets width to 100%
 * - flex-col: Sets flex direction to column
 * - justify-start: Aligns flex items to start of container
 *
 * Logo Section Classes:
 * - z-50: Sets z-index to 50 (highest stacking order)
 * - flex: Sets display to flexbox
 * - min-h-[56px]: Sets minimum height to 56px (arbitrary value)
 * - w-64: Sets width to 16rem/256px
 * - items-center: Centers items vertically
 * - justify-between: Distributes space between items
 * - bg-white: Sets background to white
 * - px-6: Sets horizontal padding to 1.5rem/24px
 * - pt-3: Sets top padding to 0.75rem/12px
 * - dark:bg-black: Sets background to black in dark mode
 *
 * Logo Text Classes:
 * - text-xl: Sets font size to 1.25rem/20px
 * - font-bold: Sets font weight to 700
 * - text-gray-800: Sets text color to dark gray
 * - dark:text-white: Sets text color to white in dark mode
 *
 * Close Button Classes:
 * - py-3: Sets vertical padding to 0.75rem/12px
 *
 * Close Icon Classes:
 * - h-6: Sets height to 1.5rem/24px
 * - w-6: Sets width to 1.5rem/24px
 * - text-gray-800: Sets text color to dark gray
 * - hover:text-gray-500: Sets text color to medium gray on hover
 * - dark:text-white: Sets text color to white in dark mode
 *
 * Team Section Classes:
 * - flex: Sets display to flexbox
 * - items-center: Centers items vertically
 * - gap-5: Sets gap between items to 1.25rem/20px
 * - border-y-[1.5px]: Sets top and bottom border to 1.5px (arbitrary value)
 * - border-gray-200: Sets border color to light gray
 * - px-8: Sets horizontal padding to 2rem/32px
 * - py-4: Sets vertical padding to 1rem/16px
 * - dark:border-gray-700: Sets border color to dark gray in dark mode
 *
 * Team Name Classes:
 * - text-md: Sets font size to medium (1rem/16px)
 * - font-bold: Sets font weight to 700
 * - tracking-wide: Sets letter spacing to 0.025em
 * - dark:text-gray-200: Sets text color to light gray in dark mode
 *
 * Privacy Section Classes:
 * - mt-1: Sets top margin to 0.25rem/4px
 * - flex: Sets display to flexbox
 * - items-start: Aligns items to start of cross axis
 * - gap-2: Sets gap between items to 0.5rem/8px
 *
 * Lock Icon Classes:
 * - mt-[0.1rem]: Sets top margin to 0.1rem (arbitrary value)
 * - h-3: Sets height to 0.75rem/12px
 * - w-3: Sets width to 0.75rem/12px
 * - text-gray-500: Sets text color to medium gray
 * - dark:text-gray-400: Sets text color to lighter gray in dark mode
 *
 * Privacy Text Classes:
 * - text-xs: Sets font size to 0.75rem/12px
 * - text-gray-500: Sets text color to medium gray
 *
 * Navigation Classes:
 * - z-10: Sets z-index to 10
 * - w-full: Sets width to 100%
 *
 * Section Toggle Button Classes:
 * - flex: Sets display to flexbox
 * - w-full: Sets width to 100%
 * - items-center: Centers items vertically
 * - justify-between: Distributes space between items
 * - px-8: Sets horizontal padding to 2rem/32px
 * - py-3: Sets vertical padding to 0.75rem/12px
 * - text-gray-500: Sets text color to medium gray
 *
 * Chevron Icon Classes:
 * - h-5: Sets height to 1.25rem/20px
 * - w-5: Sets width to 1.25rem/20px
 *
 * SidebarLink Container Classes:
 * - w-full: Sets width to 100%
 *
 * SidebarLink Content Classes:
 * - relative: Sets position to relative
 * - flex: Sets display to flexbox
 * - cursor-pointer: Changes cursor to pointer on hover
 * - items-center: Centers items vertically
 * - gap-3: Sets gap between items to 0.75rem/12px
 * - transition-colors: Applies transition to color changes
 * - hover:bg-gray-100: Sets background to light gray on hover
 * - dark:bg-black: Sets background to black in dark mode
 * - dark:hover:bg-gray-700: Sets background to dark gray on hover in dark mode
 * - bg-gray-100: Sets background to light gray (when active)
 * - text-white: Sets text color to white (when active)
 * - dark:bg-gray-600: Sets background to medium gray in dark mode (when active)
 * - justify-start: Aligns items to start of container
 * - px-8: Sets horizontal padding to 2rem/32px
 * - py-3: Sets vertical padding to 0.75rem/12px
 *
 * Active Indicator Classes:
 * - absolute: Sets position to absolute
 * - left-0: Sets left position to 0
 * - top-0: Sets top position to 0
 * - h-[100%]: Sets height to 100% (arbitrary value)
 * - w-[5px]: Sets width to 5px (arbitrary value)
 * - bg-blue-200: Sets background to light blue
 *
 * Link Icon Classes:
 * - h-6: Sets height to 1.5rem/24px
 * - w-6: Sets width to 1.5rem/24px
 * - text-gray-800: Sets text color to dark gray
 * - dark:text-gray-100: Sets text color to very light gray in dark mode
 *
 * Link Label Classes:
 * - font-medium: Sets font weight to 500
 * - text-gray-800: Sets text color to dark gray
 * - dark:text-gray-100: Sets text color to very light gray in dark mode
 *
 * Commented User Section Classes (for reference):
 * - z-10: Sets z-index to 10
 * - mt-32: Sets top margin to 8rem/128px
 * - flex: Sets display to flexbox
 * - w-full: Sets width to 100%
 * - flex-col: Sets flex direction to column
 * - items-center: Centers items horizontally
 * - gap-4: Sets gap between items to 1rem/16px
 * - bg-white: Sets background to white
 * - px-8: Sets horizontal padding to 2rem/32px
 * - py-4: Sets vertical padding to 1rem/16px
 * - dark:bg-black: Sets background to black in dark mode
 * - md:hidden: Hides element on medium screens and up
 * - align-center: Centers items (non-standard class)
 * - justify-center: Centers items horizontally
 * - h-9: Sets height to 2.25rem/36px
 * - w-9: Sets width to 2.25rem/36px
 * - h-full: Sets height to 100%
 * - rounded-full: Sets border radius to 50% (perfect circle)
 * - object-cover: Sets object-fit to cover for images
 * - cursor-pointer: Changes cursor to pointer
 * - self-center: Centers item on cross axis
 * - mx-3: Sets horizontal margin to 0.75rem/12px
 * - self-start: Aligns item to start of cross axis
 * - rounded: Sets border radius to 0.25rem/4px
 * - bg-blue-400: Sets background to medium blue
 * - px-4: Sets horizontal padding to 1rem/16px
 * - py-2: Sets vertical padding to 0.5rem/8px
 * - text-xs: Sets font size to 0.75rem/12px
 * - font-bold: Sets font weight to 700
 * - text-white: Sets text color to white
 * - hover:bg-blue-500: Sets background to darker blue on hover
 * - md:block: Shows element as block on medium screens and up
 */

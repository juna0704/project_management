import React from 'react';
import { Menu, Moon, Search, Settings, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';
import Link from 'next/link';
// import { useGetAuthUserQuery } from '@/state/api';
// import { signOut } from 'aws-amplify/auth';

/**
 * Navbar Component
 * Top navigation bar that contains search functionality, theme toggle, settings link
 * Also handles sidebar collapse/expand toggle when sidebar is collapsed
 */

const Navbar = () => {
  // Get dispatch function to update Redux state
  const dispatch = useAppDispatch();
  // Get sidebar collapsed state from Redux store
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  // Get dark mode state from Redux store
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // const { data: currentUser } = useGetAuthUserQuery({});
  // const handleSignOut = async () => {
  //   try {
  //     await signOut();
  //   } catch (error) {
  //     console.error("Error signing out: ", error);
  //   }
  // };

  // if (!currentUser) return null;
  // const currentUserDetails = currentUser?.userDetails;

  return (
    //  Main navbar container with horizontal layout, white background, padding, dark mode support
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Left section: Menu button (when sidebar collapsed) and Search Bar */}
      <div className="flex items-center gap-8">
        {/* Conditional Menu button - only shows when sidebar is collapsed  */}
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right section: Theme toggle, Settings link, and divider */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700` //// Dark mode button styling
              : `rounded p-2 hover:bg-gray-100` //// Light mode button styling
          }
        >
          {/* Conditional icon rendering based on current theme */}
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>
        {/* Settings page link */}
        <Link
          href="/settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700` // Dark mode link styling
              : `h-min w-min rounded p-2 hover:bg-gray-100` // Light mode link styling
          }
        >
          {/* Settings icon */}
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>

        {/* Vertical divider line - hidden on small screens, visible on medium+ */}
        <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
      </div>
    </div>
  );
};

export default Navbar;

/**
 * TAILWIND CSS CLASSES BREAKDOWN:
 *
 * Main Container Classes:
 * - flex: Sets display to flexbox
 * - items-center: Vertically centers flex items
 * - justify-between: Distributes space between flex items (pushes items to opposite ends)
 * - bg-white: Sets background color to white (#ffffff)
 * - px-4: Sets horizontal padding to 1rem (16px)
 * - py-3: Sets vertical padding to 0.75rem (12px)
 * - dark:bg-black: Sets background to black in dark mode
 *
 * Left Section Container Classes:
 * - flex: Sets display to flexbox
 * - items-center: Vertically centers flex items
 * - gap-8: Sets gap between flex items to 2rem (32px)
 *
 * Menu Icon Classes:
 * - h-8: Sets height to 2rem (32px)
 * - w-8: Sets width to 2rem (32px)
 * - dark:text-white: Sets text color to white in dark mode
 *
 * Search Container Classes:
 * - relative: Sets position to relative (for absolute positioning of child elements)
 * - flex: Sets display to flexbox
 * - h-min: Sets height to minimum content height
 * - w-[200px]: Sets width to exactly 200px (arbitrary value)
 *
 * Search Icon Classes:
 * - absolute: Sets position to absolute
 * - left-[4px]: Sets left position to 4px (arbitrary value)
 * - top-1/2: Sets top position to 50%
 * - mr-2: Sets right margin to 0.5rem (8px)
 * - h-5: Sets height to 1.25rem (20px)
 * - w-5: Sets width to 1.25rem (20px)
 * - -translate-y-1/2: Translates element up by 50% (centers vertically)
 * - transform: Enables CSS transforms
 * - cursor-pointer: Changes cursor to pointer on hover
 * - dark:text-white: Sets text color to white in dark mode
 *
 * Search Input Classes:
 * - w-full: Sets width to 100% of parent
 * - rounded: Sets border-radius to 0.25rem (4px)
 * - border-none: Removes all borders
 * - bg-gray-100: Sets background to light gray (#f3f4f6)
 * - p-2: Sets padding to 0.5rem (8px) on all sides
 * - pl-8: Sets left padding to 2rem (32px) to make room for icon
 * - placeholder-gray-500: Sets placeholder text color to medium gray
 * - focus:border-transparent: Makes border transparent when focused
 * - focus:outline-none: Removes default focus outline
 * - dark:bg-gray-700: Sets background to dark gray in dark mode
 * - dark:text-white: Sets text color to white in dark mode
 * - dark:placeholder-white: Sets placeholder color to white in dark mode
 *
 * Right Section Container Classes:
 * - flex: Sets display to flexbox
 * - items-center: Vertically centers flex items
 *
 * Button/Link Shared Classes:
 * - rounded: Sets border-radius to 0.25rem (4px)
 * - p-2: Sets padding to 0.5rem (8px) on all sides
 * - hover:bg-gray-100: Sets background to light gray on hover (light mode)
 * - dark:hover:bg-gray-700: Sets background to dark gray on hover (dark mode)
 * - h-min: Sets height to minimum content height
 * - w-min: Sets width to minimum content width
 *
 * Icon Classes (Sun, Moon, Settings):
 * - h-6: Sets height to 1.5rem (24px)
 * - w-6: Sets width to 1.5rem (24px)
 * - cursor-pointer: Changes cursor to pointer on hover
 * - dark:text-white: Sets text color to white in dark mode
 *
 * Divider Classes:
 * - ml-2: Sets left margin to 0.5rem (8px)
 * - mr-5: Sets right margin to 1.25rem (20px)
 * - hidden: Hides element by default
 * - min-h-[2em]: Sets minimum height to 2em (arbitrary value)
 * - w-[0.1rem]: Sets width to 0.1rem (arbitrary value for thin line)
 * - bg-gray-200: Sets background to light gray (#e5e7eb)
 * - md:inline-block: Shows element as inline-block on medium screens and up
 */

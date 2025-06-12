import { useRef } from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook, // Type helper for useSelector hook
  useDispatch, // Hook to dispatch actions
  useSelector, // Hook to select state from store
  Provider, // Component to provide store to React tree
} from 'react-redux';
import globalReducer from '@/state'; // Import your main global reducer (handles global app state)
import { api } from '@/state/api'; // Import API slice created with RTK Query (handles API calls and caching)
import { setupListeners } from '@reduxjs/toolkit/query'; // RTK Query utility to set up automatic refetching listeners

// Redux Persist imports for state persistence across browser sessions
import {
  persistStore, // Creates persistor instance
  persistReducer, // Wraps reducer with persistence capabilities
  FLUSH, // Action type for flushing pending persists
  REHYDRATE, // Action type for rehydrating persisted state
  PAUSE, // Action type for pausing persistence
  PERSIST, // Action type for persisting state
  PURGE, // Action type for purging persisted state
  REGISTER, // Action type for registering persistence
} from 'redux-persist';
// React component that delays rendering until persistence is complete
import { PersistGate } from 'redux-persist/integration/react';
// Storage creation utility for web storage (localStorage/sessionStorage)
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

/* ============================================
   REDUX PERSISTENCE CONFIGURATION
   ============================================ */
/**
 * Creates a no-operation storage interface for server-side rendering
 * This prevents errors when localStorage is not available (like during SSR)
 * Returns promises that resolve immediately without actually storing anything
 */
const createNoopStorage = () => {
  return {
    // Mock getItem - always returns null (no stored data)
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    // Mock setItem - accepts data but doesn't store it
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    // Mock removeItem - pretends to remove but does nothing
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

/**
 * Storage configuration that works in both browser and server environments
 * - Browser: Uses localStorage for actual persistence
 * - Server/SSR: Uses noop storage to prevent errors
 */

const storage =
  typeof window === 'undefined'
    ? createNoopStorage() // Server-side: use mock storage
    : createWebStorage('local'); // Client-side: use localStorage

/**
 * Redux Persist configuration object
 * Defines how the state should be persisted and rehydrated
 */
const persistConfig = {
  key: 'root', // Key used in storage (localStorage key will be 'persist:root')
  storage, // Storage engine to use (localStorage or noop)
  whitelist: ['global'], // Only persist the 'global' slice (api slice excluded for performance)
};

/**
 * Root reducer combining all feature reducers
 * - global: Main application state
 * - api: RTK Query API cache and metadata (not persisted)
 */
const rootReducer = combineReducers({
  global: globalReducer, // Your main app state reducer
  [api.reducerPath]: api.reducer, // RTK Query reducer (dynamic key based on api.reducerPath)
});

/**
 * Enhanced reducer wrapped with persistence capabilities
 * This reducer can save/restore state to/from localStorage
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ============================================
   REDUX STORE CONFIGURATION
   ============================================ */

/**
 * Store factory function that creates a new Redux store instance
 * Using a factory pattern allows for better testing and SSR support
 * Returns a configured store with middleware and persistence
 */

export const makeStore = () => {
  return configureStore({
    // Use the persisted reducer as the root reducer
    reducer: persistedReducer,

    // Configure middleware chain
    middleware: (getDefault) =>
      getDefault({
        // Configure serializable check to ignore redux-persist actions
        // These actions contain non-serializable data but are safe to ignore
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware), // Add RTK Query middleware for API caching and lifecycle
  });
};

/* REDUX TYPES */

/* ============================================
   TYPESCRIPT TYPE DEFINITIONS
   ============================================ */

// Type representing the store instance returned by makeStore()
export type AppStore = ReturnType<typeof makeStore>;

// Type representing the shape of the entire Redux state tree
export type RootState = ReturnType<AppStore['getState']>;

// Type for the dispatch function with all action types
export type AppDispatch = AppStore['dispatch'];

// Typed version of useDispatch hook with proper action types
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed version of useSelector hook with proper state types
// This provides autocomplete and type checking for state selection
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* ============================================
   STORE PROVIDER COMPONENT
   ============================================ */

/**
 * Provider component that sets up Redux store and persistence for the entire app
 *
 * Key features:
 * - Creates store instance only once using useRef
 * - Sets up RTK Query listeners for automatic refetching
 * - Configures persistence with PersistGate
 * - Provides store to all child components
 *
 * @param children - React components that need access to the Redux store
 */

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useRef ensures store is created only once, even if component re-renders
  // This prevents store recreation and state loss during hot reloads
  const storeRef = useRef<AppStore>();

  // Create store instance only if it doesn't exist yet
  if (!storeRef.current) {
    // Create new store instance
    storeRef.current = makeStore();

    // Set up RTK Query listeners for:
    // - Automatic refetching when focus returns to window
    // - Automatic refetching when network connection is restored
    // - Cache invalidation and background updates
    setupListeners(storeRef.current.dispatch);
  }

  // Create persistor instance for managing persistence lifecycle
  // This handles saving/loading state to/from localStorage
  const persistor = persistStore(storeRef.current);

  return (
    // Redux Provider makes store available to all child components
    <Provider store={storeRef.current}>
      {/* PersistGate delays rendering until persisted state is loaded */}
      {/* loading={null} means no loading spinner - you could add one here */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

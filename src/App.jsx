import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut, signInWithCustomToken } from 'firebase/auth';

import { auth } from './firebase'; // Import auth from firebase.js

import Home from './Home';
import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import VerifyEmail from './VerifyEmail';
import EnterOtp from './EnterOtp';
import ExtendedDashboard from './ExtendedDashboard';
import OurTechnology from './Our Technology';

import './styles.css';
import './index.css';

// Firebase initial auth token from Canvas environment
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// ProtectedRoute component to handle authentication checks
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl text-gray-700">Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated, preserving the intended destination
    return navigate('/login', { state: { from: location.pathname } });
  }

  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const authenticateFirebase = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
          console.log("Firebase authenticated with custom token.");
        } else {
          console.log("No initialAuthToken provided. Waiting for auth state.");
        }
      } catch (error) {
        console.error("Firebase authentication error:", error);
        setAuthError(`Failed to authenticate with Firebase: ${error.message}. Please try refreshing.`);
      }
    };

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Firebase Auth State Changed. Current User:", currentUser);
      setUser(currentUser);
      setLoadingAuth(false);
    });

    authenticateFirebase();

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Loading authentication...
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
          <strong className="font-bold">Authentication Error:</strong>
          <span className="block sm:inline ml-2">{authError}</span>
        </div>
      </div>
    );
  }

  const currentUserId = user ? user.uid : 'anonymous_user_id';

  return (
    <Router>
      <Routes>
        {/* Public Routes - accessible to all */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigateToLogin={() => navigate('/login')} />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/ExtendedDashboard" element={<ExtendedDashboard />} />
        <Route path="/Technology" element={<OurTechnology />} />
        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard userId={currentUserId} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Other routes */}
        <Route path="/about" element={<div>Coming Soon</div>} />
        <Route path="/tech" element={<div>Coming Soon</div>} />
        <Route path="/contact" element={<div>Coming Soon</div>} />

        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from './firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [business, setBusiness] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      // Check if email is already in use
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setErrorMessage('This email is already in use. Please use a different email or log in.');
        setIsLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Customize the verification link to include user data
      const actionCodeSettings = {
        url: `https://muhammadhamza125.pythonanywhere.com/verify-email?oobCode={oobCode}&email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&business=${encodeURIComponent(business)}&createdAt=${encodeURIComponent(user.metadata.creationTime)}`,
        handleCodeInApp: true,
      };

      // Send email verification link with custom parameters
      await sendEmailVerification(user, actionCodeSettings);
      setErrorMessage('Verification link sent to your email. Please click the link to complete your account creation.');
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <style jsx>{`
        /* Signup Container */
        .signup-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #d1d5db;
        }

        /* Floating Particles to Match Home */
        .signup-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.1), transparent 70%);
          z-index: 0;
        }

        .float {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(20, 184, 166, 0.3);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        /* Form Container */
        .form-container {
          background: rgba(31, 41, 55, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          max-width: 28rem;
          width: 100%;
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .form-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(20, 184, 166, 0.3);
        }

        /* Holographic Scan Effect */
        .form-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.5), transparent);
          animation: scan 4s linear infinite;
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }

        /* Headings */
        .form-container h2 {
          color: #14b8a6;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        /* Error Message */
        .error-message {
          background: #ef4444;
          color: #ffffff;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 1rem;
        }

        /* Form */
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Labels */
        .signup-form label {
          color: #14b8a6;
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        /* Inputs */
        .signup-form input {
          width: 100%;
          padding: 1rem;
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          background: rgba(31, 41, 55, 0.95);
          color: #d1d5db;
          font-size: 1.125rem;
          transition: all 0.3s ease;
        }

        .signup-form input:focus {
          outline: none;
          border-color: #14b8a6;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
        }

        /* Button */
        .signup-button {
          width: 100%;
          background: #14b8a6;
          color: #ffffff;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1.125rem;
          font-weight: bold;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .signup-button:hover {
          background: #2dd4bf;
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(20, 184, 166, 0.5);
        }

        .signup-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .signup-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .signup-button:hover::before {
          left: 100%;
        }

        /* Spinner */
        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Links */
        .signup-links a {
          color: #14b8a6;
          font-size: 1rem;
          transition: color 0.3s ease;
        }

        .signup-links a:hover {
          color: #2dd4bf;
          text-decoration: underline;
        }
      `}</style>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 3 + 3}s`,
          }}
        ></div>
      ))}

      <div className="form-container">
        <h2>Sign Up</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
          <div>
            <label>Business</label>
            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Enter your business name"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? (
              <svg className="spinner h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p className="signup-links mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
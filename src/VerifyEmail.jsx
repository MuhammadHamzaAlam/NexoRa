
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode, getAuth } from 'firebase/auth';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const oobCode = searchParams.get('oobCode');
    const email = searchParams.get('email');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const business = searchParams.get('business');
    const createdAt = searchParams.get('createdAt');

    if (!oobCode || !email || !firstName || !lastName || !business) {
      setMessage('Invalid verification link. Please sign up again.');
      setIsLoading(false);
      return;
    }

    const verifyEmailAndStoreData = async () => {
      try {
        // Verify the email using the oobCode
        await applyActionCode(auth, oobCode);
        setMessage('Email verified successfully. Creating your account...');

        // Get the current user (email should now be verified)
        const user = auth.currentUser;
        if (!user) throw new Error('User not found.');

        // Send user data to backend to store in Firestore
        const response = await fetch('https://muhammadhamza125.pythonanywhere.com/api/store-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email,
            createdAt,
            firstName,
            lastName,
            business,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to store user data in backend.');
        }

        setMessage('Account created successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Verification error:', error);
        setMessage(error.message || 'Failed to verify email or create account. Please try signing up again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmailAndStoreData();
  }, [searchParams, navigate, auth]);

  return (
    <div className="verify-email-container">
      <style jsx>{`
        /* Verify Email Container */
        .verify-email-container {
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
        .verify-email-container::before {
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

        /* Message (Success or Error) */
        .message {
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 1rem;
          color: #ffffff;
        }

        .message.success {
          background: #10b981;
        }

        .message.error {
          background: #ef4444;
        }

        /* Spinner */
        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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
        <h2>Email Verification</h2>
        {isLoading ? (
          <div className="text-center">
            <svg className="spinner h-10 w-10 text-[#14b8a6] mx-auto" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            <p className="message">{message}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</p>
            {message.includes('Failed') && (
              <button
                onClick={() => navigate('/signup')}
                className="signup-button"
              >
                Sign Up Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;



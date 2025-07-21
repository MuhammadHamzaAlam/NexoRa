
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EnterOtp = () => {
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('Enter the OTP sent to your email.');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = location.state || {};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Verifying OTP...');

    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      if (response.data.success) {
        setMessage('OTP verified successfully.');
        navigate('/change-password', { state: { email } });
      } else {
        setMessage(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setMessage(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="enter-otp-container">
      <style jsx>{`
        /* Enter OTP Container */
        .enter-otp-container {
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
        .enter-otp-container::before {
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

        /* Form */
        .enter-otp-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Labels */
        .enter-otp-form label {
          color: #14b8a6;
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        /* Inputs */
        .enter-otp-form input {
          width: 100%;
          padding: 1rem;
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          background: rgba(31, 41, 55, 0.95);
          color: #d1d5db;
          font-size: 1.125rem;
          transition: all 0.3s ease;
        }

        .enter-otp-form input:focus {
          outline: none;
          border-color: #14b8a6;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
        }

        .enter-otp-form input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Button */
        .enter-otp-button {
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

        .enter-otp-button:hover {
          background: #2dd4bf;
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(20, 184, 166, 0.5);
        }

        .enter-otp-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .enter-otp-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .enter-otp-button:hover::before {
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
        .enter-otp-links button {
          color: #14b8a6;
          font-size: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .enter-otp-links button:hover {
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
        <h2>Enter OTP</h2>
        {message && (
          <div className={`message ${message.includes('Invalid') || message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleVerifyOtp} className="enter-otp-form">
          <div>
            <label>OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP from email"
              disabled={isLoading}
              required
            />
          </div>
          <button type="submit" className="enter-otp-button" disabled={isLoading}>
            {isLoading ? (
              <svg className="spinner h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
        <p className="enter-otp-links mt-4 text-center">
          Didn’t receive an OTP?{' '}
          <button onClick={() => navigate('/forgot-password')}>Resend</button>
        </p>
      </div>
    </div>
  );
};

export default EnterOtp;

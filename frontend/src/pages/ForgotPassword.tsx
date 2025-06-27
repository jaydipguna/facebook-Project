import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 🔸 NEW
import { forgotPassword, resetPassword } from '../features/auth/authAction';

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🔸 NEW

  const handleEmailSubmit = (data) => {
    const { email } = data;
    setEmail(email);
    dispatch(forgotPassword(email));
    setTimeout(() => {
      setMessage(`If an account with ${email} exists, a password reset OTP has been sent.`);
      setEmailSent(true);
    }, 1000);
  };

  const handleResetSubmit = async (data) => {
    const { otp, newPassword } = data;
    try {
      await dispatch(resetPassword({ email, otp, newPassword }));
      setMessage('Password has been reset successfully.');
      setTimeout(() => {
        navigate('/login'); // 🔸 Redirect after short delay
      }, 1500);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Forgot Password</h2>

        {!emailSent ? (
          <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(handleResetSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp", { required: "OTP is required" })}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.otp ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}

            <input
              type="password"
              placeholder="Enter new password"
              {...register("newPassword", { required: "New password is required" })}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${
                errors.newPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
            >
              Reset Password
            </button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

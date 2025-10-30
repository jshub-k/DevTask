
import React, { useState } from 'react';
import { auth, googleProvider } from '../services/firebase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // FIX: Updated Firebase auth calls to match the v8 compat API.
  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // FIX: Updated Firebase auth calls to match the v8 compat API.
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
        await auth.signInWithPopup(googleProvider);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-brand-secondary rounded-xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-white">
          Dev Queue Kanban
        </h1>
        <form onSubmit={handleAuthAction} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div className="text-center">
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-400 hover:underline"
            >
                {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
            </button>
        </div>
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">Or</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>
        <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center py-2 px-4 bg-white text-gray-800 font-semibold rounded-md hover:bg-gray-200 transition duration-200 disabled:opacity-50"
        >
             <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.35 6.48C12.73 13.72 17.94 9.5 24 9.5z"></path>
                <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.8 7.18l8.35 6.48c4.91-4.51 7.73-11.33 7.73-18.13z"></path>
                <path fill="#FBBC05" d="M10.91 28.7a14.9 14.9 0 0 1 0-9.4l-8.35-6.48A24.003 24.003 0 0 0 0 24c0 3.58.76 6.96 2.56 9.82l8.35-6.12z"></path>
                <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-8.35-6.48c-2.15 1.45-4.92 2.3-8.54 2.3-6.06 0-11.27-4.22-13.09-9.98l-8.35 6.48A23.994 23.994 0 0 0 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
             </svg>
            Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

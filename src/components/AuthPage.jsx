import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from './auth'; // Import registerUser and loginUser functions

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Do not redirect to the game page based on the token, always show the form
  useEffect(() => {
    // We won't check the token here to allow the form to show regardless of login state
  }, []); // Empty dependency array ensures this only runs once on mount

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setError(''); // Reset error message when toggling between forms
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        return;
      }
      try {
        const response = await registerUser(username, password);
        alert('User registered successfully');
        setError(''); // Clear error
        navigate('/game'); // Redirect to the game page after registration
      } catch (error) {
        setError(error.message);
      }
    } else {
      try {
        const { token, highScore, userId } = await loginUser(username, password);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('highScore', highScore);
        navigate('/game'); // Redirect to the game page after login
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6">{isRegister ? 'Register' : 'Sign In'}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {isRegister && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isRegister ? 'Register' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={toggleForm} className="text-blue-500 hover:text-blue-700 font-bold">
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


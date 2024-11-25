import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password
    });
    console.log(response.data.message); // Check for success message
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data?.message || 'Error occurred');
    throw new Error(error.response?.data?.message || 'Error occurred');
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });
    const { token, highScore, userId } = response.data;

    // Store the token, userId, and highScore in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('highScore', highScore);
    localStorage.setItem('userId', userId);

    return { token, highScore, userId };  // Useful for subsequent components
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || 'Error occurred');
    throw new Error(error.response?.data?.message || 'Error occurred');
  }
};

export const updateHighScore = async (highScore) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const response = await axios.put(`${API_URL}/highscore`, { highScore }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Update the high score in localStorage
    localStorage.setItem('highScore', response.data.highScore);
    console.log('High Score Updated:', response.data.highScore);
    return response.data.highScore;
  } catch (error) {
    console.error('Error updating high score:', error.response?.data?.message || 'Error occurred');
    throw new Error(error.response?.data?.message || 'Error occurred');
  }
};

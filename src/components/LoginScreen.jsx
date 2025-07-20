import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { validateUser } from '../utils/userManager';
import AdminPanel from './AdminPanel';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const encouragingMessages = [
    "You're going to do great today! 🌟",
    "Every math problem you solve makes you smarter! 🧠",
    "Keep practicing and you'll be a math wizard in no time! ✨",
    "You have the power to master any math challenge! 💪",
    "Believe in yourself - you can solve anything! 🚀",
    "Math skills improve with every practice session! 📈",
    "Your brain grows stronger with each problem you solve! 🌱",
    "Today is a great day to learn something new! 🌈",
    "Small steps lead to big progress in math! 👣",
    "Remember: mistakes are just opportunities to learn! 🔍"
  ];

  const randomEncouragement = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = validateUser(username, password);

    if (user) {
      if (user.role === 'admin') {
        setCurrentUser(user);
        setShowAdminPanel(true);
      } else {
        onLogin(user.name || user.username);
      }
    } else {
      setError('Oops! Wrong username or password. Try again!');
      setUsername('');
      setPassword('');
    }
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
    setUsername('');
    setPassword('');
    setCurrentUser(null);
  };

  const handleAdminLogin = () => {
    setShowAdminPanel(false);
    onLogin(currentUser.name || currentUser.username);
  };

  if (showAdminPanel) {
    return (
      <AdminPanel 
        currentUser={currentUser} 
        onClose={handleCloseAdminPanel} 
        onLogin={handleAdminLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Math Fun Zone</h1>
          <p className="text-gray-600 text-lg">Learning Made Easy!</p>
          
          <div className="mt-4 bg-blue-50 p-3 rounded-xl border border-blue-100">
            <p className="text-blue-700 font-medium">{randomEncouragement}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 text-xl border-3 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-xl border-3 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-2 border-red-300 text-red-700 p-3 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Let's Learn Math! 🚀
          </motion.button>
        </form>
      </motion.div>
      
      <div className="absolute bottom-4 right-4 text-white text-sm font-medium opacity-80">
        Created and supported with ❤️ by BPA Solutions
      </div>
    </div>
  );
};

export default LoginScreen;
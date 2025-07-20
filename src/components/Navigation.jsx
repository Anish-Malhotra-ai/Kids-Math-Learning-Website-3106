import React from 'react';
import { motion } from 'framer-motion';

const Navigation = ({ currentUser, onLogout, selectedTopic, onTopicSelect }) => {
  const topics = [
    { name: 'Addition', icon: '➕', color: 'bg-red-500' },
    { name: 'Subtraction', icon: '➖', color: 'bg-blue-500' },
    { name: 'Multiplication', icon: '✖️', color: 'bg-green-500' },
    { name: 'Division', icon: '➗', color: 'bg-purple-500' },
    { name: 'Fractions', icon: '🍕', color: 'bg-orange-500' },
    { name: 'Times Tables', icon: '📊', color: 'bg-pink-500' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🧮</div>
            <h1 className="text-2xl font-bold text-purple-600">Math Fun Zone</h1>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {topics.map((topic) => (
              <motion.button
                key={topic.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTopicSelect(topic.name)}
                className={`${topic.color} ${
                  selectedTopic === topic.name ? 'ring-4 ring-yellow-300' : ''
                } text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
              >
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-700">Hi, {currentUser}!</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 transition-colors"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Mobile topic menu */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {topics.map((topic) => (
              <motion.button
                key={topic.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTopicSelect(topic.name)}
                className={`${topic.color} ${
                  selectedTopic === topic.name ? 'ring-4 ring-yellow-300' : ''
                } text-white px-3 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-1`}
              >
                <span>{topic.icon}</span>
                <span>{topic.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
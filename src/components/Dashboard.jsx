import React, { useState } from 'react';
import Navigation from './Navigation';
import QuizSection from './QuizSection';

const Dashboard = ({ currentUser, onLogout }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400">
      <Navigation 
        currentUser={currentUser}
        onLogout={onLogout}
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
      />
      
      <div className="pt-24 px-4">
        {selectedTopic ? (
          <QuizSection 
            topic={selectedTopic}
            onBackToTopics={handleBackToTopics}
          />
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎯</div>
            <h2 className="text-5xl font-bold text-white mb-4">Choose Your Math Adventure!</h2>
            <p className="text-2xl text-white opacity-90">Click on any topic above to start learning</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
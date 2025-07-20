import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TimesTableQuiz = ({ tableData, onComplete, onBackToTopics, onTryAgain }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});

  const encouragingMessages = [
    "You're mastering your times tables! 🌟",
    "Keep going - you're doing amazing! 🚀",
    "Times tables are the foundation of math! 💪",
    "You're building strong multiplication skills! 🏆",
    "Practice makes perfect - keep it up! ⭐",
    "Each answer brings you closer to mastery! 🧠",
    "You're becoming a multiplication champion! 🏅",
    "Great focus on your times tables! 🎯",
    "Math facts are getting easier for you! 📈",
    "You're unlocking the power of multiplication! 🔑"
  ];

  const randomEncouragement = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleWheel = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    const newResults = {};
    tableData.questions.forEach(question => {
      const userAnswer = parseInt(answers[question.id]) || 0;
      newResults[question.id] = userAnswer === question.answer;
    });
    setResults(newResults);
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    setAnswers({});
    setSubmitted(false);
    setResults({});
    onTryAgain();
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  const totalQuestions = tableData.questions.length;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-600 mb-2">
            {tableData.table} Times Table Challenge! 📊
          </h2>
          <p className="text-xl text-gray-600">
            Complete the entire {tableData.table} times table
          </p>
          
          <div className="mt-4 bg-blue-50 p-3 rounded-xl border border-blue-100 max-w-lg mx-auto">
            <p className="text-blue-700 font-medium">{randomEncouragement}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-purple-600 mb-6 text-center">
            The {tableData.table} Times Table
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tableData.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-4 rounded-xl border-2 ${
                  submitted
                    ? results[question.id]
                      ? 'border-green-400 bg-green-50'
                      : 'border-red-400 bg-red-50'
                    : 'border-purple-300 bg-white'
                }`}
              >
                <span className="text-xl font-bold text-purple-600 min-w-0 flex-shrink-0">
                  {question.question}
                </span>
                
                <input
                  type="number"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  onWheel={handleWheel}
                  disabled={submitted}
                  className="w-20 p-2 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
                  placeholder="?"
                />
                
                {submitted && (
                  <span className={`text-xl flex-shrink-0 ${
                    results[question.id] ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results[question.id] ? '✅' : '❌'}
                  </span>
                )}
                
                {submitted && !results[question.id] && (
                  <span className="text-gray-600 text-lg">
                    = {question.answer}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {!submitted ? (
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Submit All Answers! 🚀
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {correctCount === totalQuestions ? '🌟' : 
                 correctCount >= totalQuestions * 0.8 ? '👍' : '💪'}
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">
                You got {correctCount} out of {totalQuestions} correct!
              </h3>
              <p className="text-xl text-gray-600">
                {correctCount === totalQuestions ? 'Perfect! You know your times tables!' :
                 correctCount >= totalQuestions * 0.8 ? 'Great job! Almost there!' : 
                 'Keep practicing - you\'re improving!'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try Another Table 🔄
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackToTopics}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Choose Another Topic 📚
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <div className="text-center text-white text-sm opacity-80 mb-8">
        Created and supported with ❤️ by BPA Solutions
      </div>
    </div>
  );
};

export default TimesTableQuiz;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateQuestions, generateFullTimesTable } from '../utils/questionGenerator';
import TimesTableQuiz from './TimesTableQuiz';

const QuizSection = ({ topic, onBackToTopics }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [showTimesTable, setShowTimesTable] = useState(false);
  const [timesTableData, setTimesTableData] = useState(null);
  
  const encouragingMessages = [
    "You're making great progress! 🌟",
    "Keep up the excellent work! 🚀",
    "Your math skills are growing stronger! 💪",
    "You're becoming a math champion! 🏆",
    "Learning math is an adventure - you're doing great! 🧭",
    "Every problem you solve makes you smarter! 🧠",
    "You're tackling these problems like a pro! ⭐",
    "Your persistence will lead to success! 🌈",
    "Math skills improve with practice - just like you're doing! 📈",
    "You're building important skills for your future! 🌱"
  ];

  useEffect(() => {
    if (topic === 'Times Tables' && Math.random() < 0.5) {
      // 50% chance to show full times table
      const tableData = generateFullTimesTable();
      setTimesTableData(tableData);
      setShowTimesTable(true);
    } else {
      // Regular question mode
      const newQuestions = generateQuestions(topic, 10);
      setQuestions(newQuestions);
      setAnswers({});
      setSubmitted(false);
      setResults({});
      setShowTimesTable(false);
      setTimesTableData(null);
    }
  }, [topic]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Prevent mouse wheel from changing number input values
  const handleWheel = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    const newResults = {};
    questions.forEach(question => {
      const userAnswer = parseFloat(answers[question.id]) || 0;
      newResults[question.id] = Math.abs(userAnswer - question.answer) < 0.01;
    });
    setResults(newResults);
    setSubmitted(true);
  };

  const handleTryAgain = () => {
    if (topic === 'Times Tables' && Math.random() < 0.5) {
      // 50% chance to show full times table
      const tableData = generateFullTimesTable();
      setTimesTableData(tableData);
      setShowTimesTable(true);
    } else {
      // Regular question mode
      const newQuestions = generateQuestions(topic, 10);
      setQuestions(newQuestions);
      setAnswers({});
      setSubmitted(false);
      setResults({});
      setShowTimesTable(false);
      setTimesTableData(null);
    }
  };

  const handleTimesTableComplete = () => {
    setShowTimesTable(false);
    setTimesTableData(null);
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  
  // Select a random encouraging message
  const randomEncouragement = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  // Show Times Table Quiz if selected
  if (showTimesTable && timesTableData) {
    return (
      <TimesTableQuiz 
        tableData={timesTableData}
        onComplete={handleTimesTableComplete}
        onBackToTopics={onBackToTopics}
        onTryAgain={handleTryAgain}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-purple-600 mb-2">{topic} Challenge!</h2>
          <p className="text-xl text-gray-600">Answer all 10 questions below</p>
          
          <div className="mt-4 bg-blue-50 p-3 rounded-xl border border-blue-100 max-w-lg mx-auto">
            <p className="text-blue-700 font-medium">{randomEncouragement}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border-3 ${
                submitted
                  ? results[question.id]
                    ? 'border-green-400 bg-green-50'
                    : 'border-red-400 bg-red-50'
                  : 'border-purple-300 bg-purple-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                {submitted && (
                  <span className={`text-2xl ${results[question.id] ? 'text-green-600' : 'text-red-600'}`}>
                    {results[question.id] ? '✅' : '❌'}
                  </span>
                )}
              </div>
              
              <p className="text-2xl font-semibold text-gray-800 mb-4">{question.question}</p>
              
              <input
                type="number"
                step="0.01"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                onWheel={handleWheel}
                disabled={submitted}
                className="w-full p-4 text-2xl border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
                placeholder="Your answer"
              />
              
              {submitted && (
                <div className="mt-4">
                  <p className={`text-lg font-semibold ${
                    results[question.id] ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results[question.id] ? '✅ Correct!' : '❌ Needs More Work'}
                  </p>
                  {!results[question.id] && (
                    <p className="text-gray-600 mt-2">Correct answer: {question.answer}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!submitted ? (
          <div className="text-center mt-8">
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
            className="text-center mt-8"
          >
            <div className="mb-6">
              <div className="text-6xl mb-4">
                {correctCount >= 8 ? '🌟' : correctCount >= 6 ? '👍' : '💪'}
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">
                You got {correctCount} out of 10 correct!
              </h3>
              <p className="text-xl text-gray-600">
                {correctCount >= 8 ? 'Excellent work!' : 
                 correctCount >= 6 ? 'Good job!' : 'Keep practicing!'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try 10 More Questions 🔄
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

export default QuizSection;
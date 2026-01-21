import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizResults = ({ score, totalQuestions, onRetry, category }) => {
    const navigate = useNavigate();
    const percentage = Math.round((score / totalQuestions) * 100);

    let message = "";
    let color = "";

    if (percentage >= 80) {
        message = "Outstanding! You're ready to ace it!";
        color = "text-green-600";
    } else if (percentage >= 60) {
        message = "Good job! A little more polish and you're there.";
        color = "text-blue-600";
    } else {
        message = "Keep practicing! You'll get better with every attempt.";
        color = "text-amber-600";
    }

    return (
        <div className="max-w-2xl mx-auto text-center py-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="mb-8"
            >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center shadow-inner mb-6">
                    <Trophy className="w-16 h-16 text-amber-500 drop-shadow-sm" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Quiz Completed!
                </h2>
                <p className={`text-xl font-medium ${color} mb-6`}>
                    {message}
                </p>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl mb-8">
                    <div className="text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide text-sm font-semibold">Your Score</div>
                    <div className="text-6xl font-black text-gray-900 dark:text-white mb-2">
                        {score}<span className="text-3xl text-gray-400 font-normal">/{totalQuestions}</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        {percentage}% Accuracy
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={onRetry}
                    className="flex items-center justify-center px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    Retry Quiz
                </button>
                <button
                    onClick={() => navigate('/interview')}
                    className="flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                >
                    Proceed to Interview
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default QuizResults;

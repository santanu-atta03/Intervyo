import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const QuestionCard = ({
    question,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    onAnswerSelect,
    isAnswered
}) => {
    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={question.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8"
            >
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {question.text}
                </h2>

                <div className="space-y-4">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === question.correctAnswer;

                        let borderColor = 'border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500';
                        let bgColor = 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750';
                        let textColor = 'text-gray-700 dark:text-gray-200';

                        if (isAnswered) {
                            if (isSelected && !isCorrect) {
                                borderColor = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                                textColor = 'text-red-700 dark:text-red-300';
                            } else if (isCorrect) {
                                borderColor = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                                textColor = 'text-green-700 dark:text-green-300';
                            } else {
                                borderColor = 'border-gray-200 dark:border-gray-700 opacity-50';
                            }
                        } else if (isSelected) {
                            borderColor = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
                        }

                        return (
                            <motion.button
                                key={index}
                                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                onClick={() => !isAnswered && onAnswerSelect(option)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${borderColor} ${bgColor} ${textColor}`}
                                disabled={isAnswered}
                            >
                                <span className="font-medium text-lg">{option}</span>
                                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                            </motion.button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
                    >
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                            Explanation:
                        </p>
                        <p className="text-blue-900 dark:text-blue-200 leading-relaxed">
                            {question.explanation}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default QuestionCard;

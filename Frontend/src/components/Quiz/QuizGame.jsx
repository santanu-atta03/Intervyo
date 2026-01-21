import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import QuestionCard from './QuestionCard';
import QuizTimer from './QuizTimer';
import QuizResults from './QuizResults';
import { quizCategories } from '../../data/quizQuestions';

const QUESTION_TIMER_SECONDS = 30;

const QuizGame = ({ categoryId, onBack }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIMER_SECONDS);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const cat = quizCategories.find(c => c.id === categoryId);
        setCategory(cat);
    }, [categoryId]);

    useEffect(() => {
        // Reset timer when question changes
        setTimeRemaining(QUESTION_TIMER_SECONDS);
    }, [currentQuestionIndex]);

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (answer === category.questions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex + 1 < category.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const handleTimeUp = () => {
        if (!isAnswered) {
            setIsAnswered(true); // Reveal answer
            // Optionally auto-move to next or just show "Time's up" state
        }
    };

    if (!category) return <div>Loading...</div>;

    if (showResults) {
        return (
            <QuizResults
                score={score}
                totalQuestions={category.questions.length}
                onRetry={() => {
                    setScore(0);
                    setCurrentQuestionIndex(0);
                    setShowResults(false);
                    setIsAnswered(false);
                    setSelectedAnswer(null);
                }}
                category={category}
                onBack={onBack}
            />
        );
    }

    const currentQuestion = category.questions[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                </button>

                <QuizTimer
                    timeRemaining={timeRemaining}
                    setTimeRemaining={setTimeRemaining}
                    onTimeUp={handleTimeUp}
                    isPaused={isAnswered}
                />
            </div>

            <AnimatePresence mode="wait">
                <QuestionCard
                    key={currentQuestionIndex}
                    question={currentQuestion}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={category.questions.length}
                    selectedAnswer={selectedAnswer}
                    onAnswerSelect={handleAnswerSelect}
                    isAnswered={isAnswered}
                />
            </AnimatePresence>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all ${isAnswered
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        }`}
                >
                    {currentQuestionIndex + 1 === category.questions.length ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default QuizGame;

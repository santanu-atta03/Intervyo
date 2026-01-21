import React, { useState } from 'react';
import QuizSelection from '../components/Quiz/QuizSelection';
import QuizGame from '../components/Quiz/QuizGame';
import { Helmet } from 'react-helmet-async';

const QuizPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <Helmet>
                <title>Interview Quiz | Intervyo</title>
                <meta name="description" content="Warm up for your interview with interactive quizzes." />
            </Helmet>

            {selectedCategory ? (
                <QuizGame
                    categoryId={selectedCategory}
                    onBack={() => setSelectedCategory(null)}
                />
            ) : (
                <QuizSelection onSelectCategory={setSelectedCategory} />
            )}
        </div>
    );
};

export default QuizPage;

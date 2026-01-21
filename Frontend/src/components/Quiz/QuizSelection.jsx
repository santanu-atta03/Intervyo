import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code, BrainCircuit, ArrowRight } from 'lucide-react';
import { quizCategories } from '../../data/quizQuestions';

const iconMap = {
    Users: Users,
    Code: Code,
    BrainCircuit: BrainCircuit,
};

const QuizSelection = ({ onSelectCategory }) => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Interview Warm-up Checkpoints
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                    Choose a category to start a quick revision session. Sharpen your skills before the real deal!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {quizCategories.map((category, index) => {
                    const Icon = iconMap[category.icon];
                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer group"
                            onClick={() => onSelectCategory(category.id)}
                        >
                            <div className="p-8">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${index === 0 ? 'from-blue-500 to-cyan-500' :
                                        index === 1 ? 'from-purple-500 to-pink-500' :
                                            'from-amber-500 to-orange-500'
                                    }`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {category.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                                    {category.description}
                                </p>

                                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                                    Start Quiz <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizSelection;

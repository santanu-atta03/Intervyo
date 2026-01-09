import { useState } from "react";

export default function useInterviewFlow() {
  const [isThinking, setIsThinking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const askNextQuestion = async (fetchQuestionFn) => {
    // Show thinking state
    setIsThinking(true);

    // Intentional pause → feels human, not instant AI
    await new Promise((res) => setTimeout(res, 600));

    const nextQuestion = await fetchQuestionFn();

    setCurrentQuestion(nextQuestion);
    setIsThinking(false);
  };

  return {
    isThinking,
    currentQuestion,
    askNextQuestion,
  };
}

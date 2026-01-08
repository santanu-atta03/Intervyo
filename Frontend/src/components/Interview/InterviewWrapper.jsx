import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import io from "socket.io-client";

import InterviewRoom from "../AiInterview/InterviewRoom";
import InterviewPermissionCheck from "./InterviewPermissionCheck";

import ThinkingIndicator from "./ThinkingIndicator";
import QuestionTransition from "./QuestionTransition";
import useInterviewFlow from "../../hooks/useInterviewFlow";

import {
  getInterviewById,
  getInterviewSession,
  startInterview,
} from "../../services/operations/aiInterviewApi";

const InterviewWrapper = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // ✅ Hook MUST be inside component
  const {
    isThinking,
    currentQuestion,
    askNextQuestion,
  } = useInterviewFlow();

  if (!permissionsGranted) {
    return (
      <InterviewPermissionCheck
        onPermissionsGranted={() => setPermissionsGranted(true)}
      />
    );
  }

  return (
    <div className="relative">
      {/* Smooth question transition */}
  

      {currentQuestion && (
        <QuestionTransition question={currentQuestion} />
      )}

      {/* Thinking / loading feedback */}
      {isThinking && <ThinkingIndicator />}

      {/* Existing interview logic untouched */}
      <InterviewRoom
        interviewId={interviewId}
        token={token}
        navigate={navigate}
        getInterviewById={getInterviewById}
        getInterviewSession={getInterviewSession}
        startInterview={startInterview}
        io={io}
        askNextQuestion={askNextQuestion} // passed for controlled flow
      />
    </div>
  );
};

export default InterviewWrapper;

import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import InterviewRoom from '../AiInterview/InterviewRoom';
import { getInterviewById, getInterviewSession, startInterview } from '../../services/operations/aiInterviewApi';

const InterviewWrapper = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  return (
    <InterviewRoom
      interviewId={interviewId}
      token={token}
      navigate={navigate}
      getInterviewById={getInterviewById}
      getInterviewSession={getInterviewSession}
      startInterview={startInterview}
      io={io}
    />
  );
};

export default InterviewWrapper;
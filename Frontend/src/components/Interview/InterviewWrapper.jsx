import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import InterviewRoom from '../AiInterview/InterviewRoom';
import { getInterviewById, getInterviewSession, startInterview } from '../../services/operations/aiInterviewApi';
import InterviewPermissionCheck from './InterviewPermissionCheck';
import { useState } from 'react';

const InterviewWrapper = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [permissionsGranted, setPermissionsGranted] = useState(false);

  if (!permissionsGranted) {
    return (
      <InterviewPermissionCheck
        onPermissionsGranted={() => setPermissionsGranted(true)}
      />
    );
  }
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
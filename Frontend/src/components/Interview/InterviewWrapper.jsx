// frontend/src/components/InterviewWrapper.jsx
import { useState } from 'react';
import InterviewPermissionCheck from './InterviewPermissionCheck';
import InterviewRoom from '../AiInterview/InterviewRoom';

export default function InterviewWrapper() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  if (!permissionsGranted) {
    return (
      <InterviewPermissionCheck 
        onPermissionsGranted={() => setPermissionsGranted(true)} 
      />
    );
  }

  return <InterviewRoom />;
}
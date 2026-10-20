import { useState } from "react";

import InterviewRoom from "../AiInterview/InterviewRoom";
import InterviewPermissionCheck from "./InterviewPermissionCheck";

const InterviewWrapper = () => {
  const [mediaStream, setMediaStream] = useState(null);

  if (!mediaStream) {
    return (
      <InterviewPermissionCheck
        onPermissionsGranted={setMediaStream}
      />
    );
  }

  return (
    <div className="relative">
      <InterviewRoom initialStream={mediaStream} />
    </div>
  );
};

export default InterviewWrapper;

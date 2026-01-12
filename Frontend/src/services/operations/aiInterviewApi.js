import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { interviewEndpoints } from '../apis';

const INTERVIEW_ENDPOINTS = {
  CREATE_INTERVIEW: 'https://intervyo.onrender.com/api/interviews/create',
  GET_ALL_INTERVIEWS: 'https://intervyo.onrender.com/api/interviews/all',
  GET_INTERVIEW: 'https://intervyo.onrender.com/api/interviews',
  START_INTERVIEW: 'https://intervyo.onrender.com/api/interviews',
  END_INTERVIEW: 'https://intervyo.onrender.com/api/interviews',
  GET_SESSION: 'https://intervyo.onrender.com/api/interviews',
  DELETE_INTERVIEW: 'https://intervyo.onrender.com/api/interviews',
  
};
const {GET_RESULTS_API} = interviewEndpoints

const AI_ENDPOINTS = {
  GENERATE_QUESTIONS: 'https://intervyo.onrender.com/api/ai/generate-questions',
  EVALUATE_ANSWER: 'https://intervyo.onrender.com/api/ai/evaluate-answer',
  NEXT_QUESTION: 'https://intervyo.onrender.com/api/ai/next-question',
  COMPLETE_INTERVIEW: 'https://intervyo.onrender.com/api/ai/complete-interview',
};


// Create new interview
export const createInterview = async (formData, setLoading,token) => {
  const toastId = toast.loading('Scheduling interview...');
  setLoading(true);

  try {
    const response = await apiConnector(
      'POST',
      INTERVIEW_ENDPOINTS.CREATE_INTERVIEW,
      formData,
      {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      }
    );

    if (response.data.success) {
      toast.success('Interview scheduled successfully!', { id: toastId });
      return response.data.data;
    }
  } catch (error) {
    console.error('Create interview error:', error);
    toast.error(error.response?.data?.message || 'Failed to schedule interview', {
      id: toastId,
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

// Get all interviews
export const getAllInterviews = async (setLoading,token) => {
  setLoading(true);

  try {
    const response = await apiConnector('GET', INTERVIEW_ENDPOINTS.GET_ALL_INTERVIEWS, {} , {
        Authorization: `Bearer ${token}`
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Get interviews error:', error);
    toast.error('Failed to fetch interviews');
    throw error;
  } finally {
    setLoading(false);
  }
};

// Get single interview
export const getInterviewById = async (interviewId,token) => {
  try {
    const response = await apiConnector(
      'GET',
      `${INTERVIEW_ENDPOINTS.GET_INTERVIEW}/${interviewId}`, {}, {
        Authorization: `Bearer ${token}`
      }
    );

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Get interview error:', error);
    toast.error('Failed to fetch interview details');
    throw error;
  }
};

// Start interview
export const startInterview = async (interviewId, setLoading,token) => {
  const toastId = toast.loading('Starting interview...');
  setLoading(true);

  try {
    const response = await apiConnector(
      'POST',
      `${INTERVIEW_ENDPOINTS.START_INTERVIEW}/${interviewId}/start`,{},{
        Authorization: `Bearer ${token}`
      }
    );

    if (response.data.success) {
      toast.success('Interview started!', { id: toastId });
      return response.data.data;
    }
  } catch (error) {
    console.error('Start interview error:', error);
    toast.error(error.response?.data?.message || 'Failed to start interview', {
      id: toastId,
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

// Get interview session
export const getInterviewSession = async (interviewId,token) => {
  try {
    const response = await apiConnector(
      'GET',
      `${INTERVIEW_ENDPOINTS.GET_SESSION}/${interviewId}/session`,{},{Authorization: `Bearer ${token}`}
    );

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Get session error:', error);
    throw error;
  }
};

// End interview
export const endInterview = async (interviewId, sessionId, setLoading) => {
  const toastId = toast.loading('Ending interview...');
  setLoading(true);

  try {
    const response = await apiConnector(
      'POST',
      `${INTERVIEW_ENDPOINTS.END_INTERVIEW}/${interviewId}/end`
    );

    if (response.data.success) {
      toast.success('Interview completed!', { id: toastId });
      return response.data.data;
    }
  } catch (error) {
    console.error('End interview error:', error);
    toast.error('Failed to end interview', { id: toastId });
    throw error;
  } finally {
    setLoading(false);
  }
};

// Delete interview
export const deleteInterview = async (interviewId, setLoading) => {
  const toastId = toast.loading('Deleting interview...');
  setLoading(true);

  try {
    const response = await apiConnector(
      'DELETE',
      `${INTERVIEW_ENDPOINTS.DELETE_INTERVIEW}/${interviewId}`
    );

    if (response.data.success) {
      toast.success('Interview deleted!', { id: toastId });
      return true;
    }
  } catch (error) {
    console.error('Delete interview error:', error);
    toast.error('Failed to delete interview', { id: toastId });
    throw error;
  } finally {
    setLoading(false);
  }
};

// AI Operations

// Generate questions
export const generateQuestions = async (interviewId) => {
  try {
    const response = await apiConnector('POST', AI_ENDPOINTS.GENERATE_QUESTIONS, {
      interviewId,
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Generate questions error:', error);
    throw error;
  }
};

// Evaluate answer
export const evaluateAnswer = async (sessionId, question, answer, codeSubmitted = null) => {
  try {
    const response = await apiConnector('POST', AI_ENDPOINTS.EVALUATE_ANSWER, {
      sessionId,
      question,
      answer,
      codeSubmitted,
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Evaluate answer error:', error);
    throw error;
  }
};

// Get next question
export const getNextQuestion = async (sessionId) => {
  try {
    const response = await apiConnector('POST', AI_ENDPOINTS.NEXT_QUESTION, {
      sessionId,
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Get next question error:', error);
    throw error;
  }
};

// Complete interview
export const completeInterview = async (interviewId, token) => {
  const toastId = toast.loading("Generating results...");
  
  try {
    const response = await apiConnector(
      "POST",
      AI_ENDPOINTS.COMPLETE_INTERVIEW,
      { interviewId },
      {
        Authorization: `Bearer ${token}`
      }
    );

    console.log("Complete Interview API Response:", response);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to complete interview");
    }

    toast.success("Results generated successfully!", { id: toastId });
    
    // Return the data object which contains session and feedback
    return response.data.data;
    
  } catch (error) {
    console.error("Complete Interview API Error:", error);
    toast.error(error.response?.data?.message || "Failed to generate results", { id: toastId });
    throw error;
  }
};

// Get interview results (if needed separately)
export const getInterviewResults = async (interviewId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_RESULTS_API,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch results");
    }

    return response.data.data;
    
  } catch (error) {
    console.error("Get Results API Error:", error);
    throw error;
  }
};
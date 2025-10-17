import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiconnector';

const INTERVIEW_ENDPOINTS = {
  CREATE_INTERVIEW: 'http://localhost:5000/api/interviews/create',
  GET_ALL_INTERVIEWS: 'http://localhost:5000/api/interviews/all',
  GET_INTERVIEW: 'http://localhost:5000/api/interviews',
  START_INTERVIEW: 'http://localhost:5000/api/interviews',
  END_INTERVIEW: 'http://localhost:5000/api/interviews',
  GET_SESSION: 'http://localhost:5000/api/interviews',
  DELETE_INTERVIEW: 'http://localhost:5000/api/interviews',
};

const AI_ENDPOINTS = {
  GENERATE_QUESTIONS: 'http://localhost:5000/api/ai/generate-questions',
  EVALUATE_ANSWER: 'http://localhost:5000/api/ai/evaluate-answer',
  NEXT_QUESTION: 'http://localhost:5000/api/ai/next-question',
  COMPLETE_INTERVIEW: 'http://localhost:5000/api/ai/complete-interview',
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
export const completeInterview = async (sessionId, interviewId) => {
  const toastId = toast.loading('Generating feedback...');

  try {
    const response = await apiConnector('POST', AI_ENDPOINTS.COMPLETE_INTERVIEW, {
      sessionId,
      interviewId,
    });

    if (response.data.success) {
      toast.success('Feedback generated!', { id: toastId });
      return response.data.data;
    }
  } catch (error) {
    console.error('Complete interview error:', error);
    toast.error('Failed to generate feedback', { id: toastId });
    throw error;
  }
};
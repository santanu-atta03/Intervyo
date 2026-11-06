import { notify } from "../../utils/sileoNotifications";
import { apiConnector } from "../apiConnector";
import { interviewEndpoints, BASE_URL } from "../apis";

const INTERVIEW_ENDPOINTS = {
  CREATE_INTERVIEW: `${BASE_URL}/interviews/create`,
  GET_ALL_INTERVIEWS: `${BASE_URL}/interviews/all`,
  GET_INTERVIEW: `${BASE_URL}/interviews`,
  START_INTERVIEW: `${BASE_URL}/interviews`,
  END_INTERVIEW: `${BASE_URL}/interviews`,
  GET_SESSION: `${BASE_URL}/interviews`,
  DELETE_INTERVIEW: `${BASE_URL}/interviews`,
};
const { GET_RESULTS_API } = interviewEndpoints;

const AI_ENDPOINTS = {
  GENERATE_QUESTIONS: `${BASE_URL}/ai/generate-questions`,
  EVALUATE_ANSWER: `${BASE_URL}/ai/evaluate-answer`,
  NEXT_QUESTION: `${BASE_URL}/ai/next-question`,
  COMPLETE_INTERVIEW: `${BASE_URL}/ai/complete-interview`,
};

// Create new interview
export const createInterview = async (formData, setLoading, token) => {
  const toastId = notify.loading("Scheduling interview...");
  setLoading(true);

  try {
    const response = await apiConnector(
      "POST",
      INTERVIEW_ENDPOINTS.CREATE_INTERVIEW,
      formData,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (response.data.success) {
      notify.success("Interview scheduled successfully!", { id: toastId });
      return response.data.data;
    }
  } catch (error) {
    console.error("Create interview error:", error);
    notify.error(
      error.response?.data?.message || "Failed to schedule interview",
      {
        id: toastId,
      },
    );
    throw error;
  } finally {
    setLoading(false);
  }
};

// Get all interviews
export const getAllInterviews = async (setLoading, token) => {
  setLoading(true);

  try {
    const response = await apiConnector(
      "GET",
      INTERVIEW_ENDPOINTS.GET_ALL_INTERVIEWS,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Get interviews error:", error);
    notify.error("Failed to fetch interviews");
    throw error;
  } finally {
    setLoading(false);
  }
};

// Get single interview
export const getInterviewById = async (interviewId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${INTERVIEW_ENDPOINTS.GET_INTERVIEW}/${interviewId}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Get interview error:", error);
    notify.error("Failed to fetch interview details");
    throw error;
  }
};

// Start interview
export const startInterview = async (interviewId, setLoading, token) => {
  const toastId = notify.loading("Starting interview...");
  setLoading(true);

  try {
    const response = await apiConnector(
      "POST",
      `${INTERVIEW_ENDPOINTS.START_INTERVIEW}/${interviewId}/start`,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (response.data.success) {
      notify.success("Interview started!", { id: toastId });
      return response.data.data;
    }
  } catch (error) {
    console.error("Start interview error:", error);
    notify.error(error.response?.data?.message || "Failed to start interview", {
      id: toastId,
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

// Get interview session
export const getInterviewSession = async (interviewId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${INTERVIEW_ENDPOINTS.GET_SESSION}/${interviewId}/session`,
      {},
      { Authorization: `Bearer ${token}` },
    );

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Get session error:", error);
    throw error;
  }
};

// End interview
export const endInterview = async (interviewId, sessionId, setLoading, token) => {
  const toastId = notify.loading("Ending interview...");
  setLoading(true);

  try {
    const response = await apiConnector(
      "POST",
      `${INTERVIEW_ENDPOINTS.END_INTERVIEW}/${interviewId}/end`,
      { sessionId },
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      notify.success("Interview completed!", { id: toastId });
      return response.data.data;
    }
  } catch (error) {
    console.error("End interview error:", error);
    notify.error("Failed to end interview", { id: toastId });
    throw error;
  } finally {
    setLoading(false);
  }
};

// Delete interview
export const deleteInterview = async (interviewId, setLoading, token) => {
  const toastId = notify.loading("Deleting interview...");
  setLoading(true);

  try {
    const response = await apiConnector(
      "DELETE",
      `${INTERVIEW_ENDPOINTS.DELETE_INTERVIEW}/${interviewId}`,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (response.data.success) {
      notify.success("Interview deleted!", { id: toastId });
      return true;
    }
  } catch (error) {
    console.error("Delete interview error:", error);
    notify.error("Failed to delete interview", { id: toastId });
    throw error;
  } finally {
    setLoading(false);
  }
};

// AI Operations

// Generate questions
export const generateQuestions = async (interviewId) => {
  try {
    const response = await apiConnector(
      "POST",
      AI_ENDPOINTS.GENERATE_QUESTIONS,
      {
        interviewId,
      },
    );

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Generate questions error:", error);
    throw error;
  }
};

// Evaluate answer
export const evaluateAnswer = async (
  sessionId,
  question,
  answer,
  codeSubmitted = null,
) => {
  try {
    const response = await apiConnector("POST", AI_ENDPOINTS.EVALUATE_ANSWER, {
      sessionId,
      question,
      answer,
      codeSubmitted,
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Evaluate answer error:", error);
    throw error;
  }
};

// Get next question
export const getNextQuestion = async (sessionId) => {
  try {
    const response = await apiConnector("POST", AI_ENDPOINTS.NEXT_QUESTION, {
      sessionId,
    });

    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Get next question error:", error);
    throw error;
  }
};

// Complete interview
export const completeInterview = async (interviewId, token) => {
  const toastId = notify.loading("Generating results...");

  try {
    const response = await apiConnector(
      "POST",
      AI_ENDPOINTS.COMPLETE_INTERVIEW,
      { interviewId },
      {
        Authorization: `Bearer ${token}`,
      },
    );

    console.log("Complete Interview API Response:", response);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to complete interview");
    }

    notify.success("Results generated successfully!", { id: toastId });

    // Return the data object which contains session and feedback
    return response.data.data;
  } catch (error) {
    console.error("Complete Interview API Error:", error);
    notify.error(error.response?.data?.message || "Failed to generate results", {
      id: toastId,
    });
    throw error;
  }
};

// Get interview results (if needed separately)
export const getInterviewResults = async (interviewId, token) => {
  try {
    const response = await apiConnector("GET", GET_RESULTS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch results");
    }

    return response.data.data;
  } catch (error) {
    console.error("Get Results API Error:", error);
    throw error;
  }
};

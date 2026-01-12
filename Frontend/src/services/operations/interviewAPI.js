// src/services/operations/interviewAPI.js
import { toast } from "react-hot-toast";

import { interviewEndpoints } from "../apis";
import {
  setCurrentInterview,
  setInterviewData,
  setCurrentQuestion,
  addAnswer,
  updateMetrics,
  setLoading,
  setError,
  resetInterview,
  setCurrentQuestionIndex,
  updatePerformance,
  updateProgress,
} from "../../slices/interviewSlice";
import { apiConnector } from "../apiConnector";
import { customToast } from "../../utils/toast";

const {
  CREATE_INTERVIEW_API,
  START_INTERVIEW_API,
  SUBMIT_ANSWER_API,
  COMPLETE_INTERVIEW_API,
  GET_INTERVIEW_API,
  START_CONVERSATION_API,
} = interviewEndpoints;

const BASE_URL = "https://intervyo.onrender.com";
// export const createInterview = (interviewConfig, navigate,token) => {
//   return async (dispatch) => {
//     const toastId = toast.loading('Creating your interview...');
//     dispatch(setLoading(true));

//     try {
//       const response = await apiConnector(
//         'POST',
//         CREATE_INTERVIEW_API,
//         interviewConfig,
//         {
//           Authorization: `Bearer ${token}`,
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       dispatch(setCurrentInterview(response.data.data));
//       toast.success('Interview created successfully!');

//       // Navigate to interview room
//       navigate(`/interview/${response.data.data.id}`);
//     } catch (error) {
//       console.error('CREATE_INTERVIEW_API ERROR:', error);
//       toast.error(error.response?.data?.message || 'Failed to create interview');
//       dispatch(setError(error.message));
//     } finally {
//       toast.dismiss(toastId);
//       dispatch(setLoading(false));
//     }
//   };
// };

export const createInterview = (interviewConfig, navigate, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Creating your interview...");
    dispatch(setLoading(true));

    try {
      // Validate config before sending
      if (
        !interviewConfig.domain ||
        !interviewConfig.subDomain ||
        !interviewConfig.interviewType
      ) {
        throw new Error("Please complete all required fields");
      }

      // Prepare data (exclude resume file from direct JSON)
      const dataToSend = {
        domain: interviewConfig.domain,
        subDomain: interviewConfig.subDomain,
        interviewType: interviewConfig.interviewType,
        difficulty: interviewConfig.difficulty,
        duration: interviewConfig.duration,
        targetCompany: interviewConfig.targetCompany,
        customQuestions: interviewConfig.questions, // Send array of questions
      };

      const response = await apiConnector(
        "POST",
        CREATE_INTERVIEW_API,
        dataToSend,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setCurrentInterview(response.data.data));
      toast.success("Interview created successfully!");

      // Navigate to interview room
      navigate(`/interview/${response.data.data.id}`);
    } catch (error) {
      console.error("CREATE_INTERVIEW_API ERROR:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create interview",
      );
      dispatch(setError(error.message));
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
};

export const startInterview = (interviewId, token) => {
  return async (dispatch) => {
    const toastId = customToast.loading("Starting interview...");
    dispatch(setLoading(true));
    const url = START_INTERVIEW_API.replace(":interviewId", interviewId);
    try {
      const response = await apiConnector(
        "POST",
        url,
        {},
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setInterviewData(response.data.data));
      customToast.success("Interview started! Good luck! 🚀");
    } catch (error) {
      console.error("START_INTERVIEW_API ERROR:", error);
      customToast.error(
        error.response?.data?.message || "Failed to start interview",
      );
      dispatch(setError(error.message));
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
};

// export const submitAnswer = (interviewId, answerData, token,navigate) => {
//   return async (dispatch, getState) => {
//     dispatch(setLoading(true));
//   const url = SUBMIT_ANSWER_API.replace(":interviewId", interviewId);
//     try {
//       const response = await apiConnector(
//         "POST",
//         url,
//         answerData,
//         {
//           Authorization: `Bearer ${token}`,
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       const { evaluation, nextQuestion, currentScore, categoryScores } =
//         response.data.data;

//       // Add answer to history
//       dispatch(
//         addAnswer({
//           ...answerData,
//           evaluation,
//         })
//       );

//       // Update progress
//       const currentProgress = getState().interview.progress;
//       dispatch(
//         updateProgress({
//           answered: currentProgress.answered + 1,
//           total: response.data.data.progress?.total || currentProgress.total,
//           percentage:
//             response.data.data.progress?.percentage ||
//             currentProgress.percentage,
//         })
//       );

//       // Update performance
//       if (response.data.data.currentScore !== undefined) {
//         dispatch(
//           updatePerformance({
//             questionsAnswered: currentProgress.answered + 1,
//             overallScore: response.data.data.currentScore,
//           })
//         );
//       }

//       // Update question index
//       const newIndex = getState().interview.currentQuestionIndex + 1;
//       dispatch(setCurrentQuestionIndex(newIndex));

//       // Update metrics
//       if (categoryScores) {
//         dispatch(updateMetrics(categoryScores));
//       }

//       // Set next question or complete
//       if (nextQuestion) {
//         dispatch(setCurrentQuestion(nextQuestion));
//         toast.success(`Score: ${evaluation.overallScore}/100`);
//       } else {
//         toast.success("Interview completed!");
//         dispatch(completeInterview(interviewId, navigate,token))
//       }

//       return response.data.data;
//     } catch (error) {
//       console.error("SUBMIT_ANSWER_API ERROR:", error);
//       toast.error(error.response?.data?.message || "Failed to submit answer");
//       dispatch(setError(error.message));
//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// };

export const completeInterview = (interviewId, navigate, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Generating your results...");
    dispatch(setLoading(true));
    const url = COMPLETE_INTERVIEW_API.replace(":interviewId", interviewId);
    try {
      const response = await apiConnector(
        "POST",
        url,
        {},
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Interview completed successfully! 🎉");

      // Navigate to results page
      navigate(`/results/${interviewId}`);

      // Reset interview state
      dispatch(resetInterview());
    } catch (error) {
      console.error("COMPLETE_INTERVIEW_API ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete interview",
      );
      dispatch(setError(error.message));
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
};

export const getInterviewData = (interviewId, token) => {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "GET",
        GET_INTERVIEW_API(interviewId),
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setInterviewData(response.data.data));
    } catch (error) {
      console.error("GET_INTERVIEW_API ERROR:", error);
      toast.error("Failed to load interview data");
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// services/operations/interviewAPI.js

// Add this function
export const getRealTimeAIResponse = async (interviewId, data, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${BASE_URL}/api/interview/${interviewId}/real-time-response`,
      data,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Real-time AI response error:", error);
    throw error;
  }
};

export const evaluateCodeSubmission = async (interviewId, data, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${BASE_URL}/api/interview/${interviewId}/evaluate-code`,
      data,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Code evaluation error:", error);
    throw error;
  }
};
// services/operations/interviewAPI.js - ADD THESE FUNCTIONS

export const startConversation = async (interviewId, token) => {
  const url = START_CONVERSATION_API.replace(":interviewId", interviewId);
  try {
    const response = await apiConnector(
      "POST",
      url,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Start conversation error:", error);
    throw error;
  }
};

export const askNextQuestion = async (interviewId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${BASE_URL}/api/interview/${interviewId}/ask-next-question`,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Ask question error:", error);
    throw error;
  }
};

export const submitAnswer = async (interviewId, answerData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${process.env.REACT_APP_BASE_URL}/api/interview/${interviewId}/submit-answer`,
      answerData,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Submit answer error:", error);
    throw error;
  }
};

// import toast from 'react-hot-toast';
// import { apiConnector } from '../apiConnector.js';
// import { interviewEndpoints } from '../apis';
// import {
//   setInterviewData,
//   setCurrentQuestion,
//   updateMetrics,
//   updateProgress,
//   setLoading,
//   setError,
//   setCurrentInterview
// } from '../../slices/interviewSlice';
// import { customToast } from '../../utils/toast';

// const {
//   CREATE_INTERVIEW_API,
//   START_INTERVIEW_API,
//   SUBMIT_ANSWER_API,
//   COMPLETE_INTERVIEW_API,
//   GET_RESULTS_API
// } = interviewEndpoints;

//  export const createInterview = (interviewConfig, navigate, token) => {
//   return async (dispatch) => {
//     const toastId = customToast.loading('Creating your interview...');
//     dispatch(setLoading(true));

//     try {
//       // Validate config before sending
//       if (!interviewConfig.domain || !interviewConfig.subDomain || !interviewConfig.interviewType) {
//         throw new Error('Please complete all required fields');
//       }

//       // Prepare data (exclude resume file from direct JSON)
//       const dataToSend = {
//         domain: interviewConfig.domain,
//         subDomain: interviewConfig.subDomain,
//         interviewType: interviewConfig.interviewType,
//         difficulty: interviewConfig.difficulty,
//         duration: interviewConfig.duration,
//         targetCompany: interviewConfig.targetCompany,
//         customQuestions: interviewConfig.questions // Send array of questions
//       };

//       const response = await apiConnector(
//         'POST',
//         CREATE_INTERVIEW_API,
//         dataToSend,
//         {
//           Authorization: `Bearer ${token}`,
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       dispatch(setCurrentInterview(response.data.data));
//       customToast.success('Interview created successfully!');

//       // Navigate to interview room
//       navigate(`/interview/${response.data.data.id}`);
//     } catch (error) {
//       console.error('CREATE_INTERVIEW_API ERROR:', error);
//       customToast.error(error.response?.data?.message || error.message || 'Failed to create interview');
//       dispatch(setError(error.message));
//     } finally {
//       customToast.dismiss(toastId);
//       dispatch(setLoading(false));
//     }
//   };
// };
// // Start Interview
// export function startInterview(interviewId, token) {
//   return async (dispatch) => {
//     dispatch(setLoading(true));
//     try {
//       // Replace :interviewId with actual ID
//       const url = START_INTERVIEW_API.replace(':interviewId', interviewId);

//       const response = await apiConnector(
//         'POST',
//         url,
//         {},
//         {
//           Authorization: `Bearer ${token}`
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       dispatch(setInterviewData(response.data.data));
//       dispatch(setCurrentQuestion(response.data.data.currentQuestion));
//       customToast.success('Interview started successfully!');
//     } catch (error) {
//       console.error('START_INTERVIEW_API ERROR:', error);
//       customToast.error(error.response?.data?.message || 'Failed to start interview');
//       dispatch(setError(error.message));
//     }
//     dispatch(setLoading(false));
//   };
// }

// // Submit Answer
// // export function submitAnswer(interviewId, answerData, token) {
// //   return async (dispatch) => {
// //     try {
// //       const url = SUBMIT_ANSWER_API.replace(':interviewId', interviewId);

// //       const response = await apiConnector(
// //         'POST',
// //         url,
// //         answerData,
// //         {
// //           Authorization: `Bearer ${token}`
// //         }
// //       );

// //       if (!response.data.success) {
// //         throw new Error(response.data.message);
// //       }

// //       // Update metrics
// //       if (response.data.data.metrics) {
// //         dispatch(updateMetrics(response.data.data.metrics));
// //       }

// //       // Get next question
// //       if (response.data.data.nextQuestion) {
// //         dispatch(setCurrentQuestion(response.data.data.nextQuestion));
// //         toast.success('Answer submitted!');
// //       } else {
// //         toast.success('All questions completed!');
// //       }

// //       return response.data;
// //     } catch (error) {
// //       console.error('SUBMIT_ANSWER_API ERROR:', error);
// //       toast.error(error.response?.data?.message || 'Failed to submit answer');
// //       throw error;
// //     }
// //   };
// // }
// // services/operations/interviewAPI.js - UPDATE submitAnswer function

// export function submitAnswer(interviewId, answerData, token) {
//   return async (dispatch) => {
//     try {
//       const url = SUBMIT_ANSWER_API.replace(':interviewId', interviewId);

//       const response = await apiConnector(
//         'POST',
//         url,
//         answerData,
//         {
//           Authorization: `Bearer ${token}`
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       // CRITICAL FIX: Update metrics immediately
//       if (response.data.data.metrics) {
//         console.log('Updating metrics:', response.data.data.metrics);
//         dispatch(updateMetrics(response.data.data.metrics));
//       }

//       // CRITICAL FIX: Update progress
//       if (response.data.data.progress) {
//         console.log('Updating progress:', response.data.data.progress);
//         dispatch(updateProgress(response.data.data.progress));
//       }

//       // CRITICAL FIX: Set next question or mark as complete
//       if (response.data.data.nextQuestion) {
//         console.log('Setting next question:', response.data.data.nextQuestion);
//         dispatch(setCurrentQuestion(response.data.data.nextQuestion));
//         customToast.success('Answer submitted! Next question loaded.');
//       } else if (response.data.data.isComplete) {
//         customToast.success('All questions completed!');
//         // Don't set null - keep current question visible
//       }

//       return response.data;
//     } catch (error) {
//       console.error('SUBMIT_ANSWER_API ERROR:', error);
//       customToast.error(error.response?.data?.message || 'Failed to submit answer');
//       throw error;
//     }
//   };
// }

// // Complete Interview
// export function completeInterview(interviewId, navigate, token) {
//   return async (dispatch) => {
//     const toastId = customToast.loading('Submitting your interview...');
//     try {
//       const url = COMPLETE_INTERVIEW_API.replace(':interviewId', interviewId);

//       const response = await apiConnector(
//         'POST',
//         url,
//         {},
//         {
//           Authorization: `Bearer ${token}`
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       customToast.success('Interview completed! Generating report...', { id: toastId });
//       navigate(`/results/${interviewId}`);
//     } catch (error) {
//       console.error('COMPLETE_INTERVIEW_API ERROR:', error);
//       toast.error(error.response?.data?.message || 'Failed to complete interview', { id: toastId });
//     }
//   };
// }

// // Get Interview Results
// export function getInterviewResults(interviewId, token) {
//   return async (dispatch) => {
//     dispatch(setLoading(true));
//     try {
//       const url = GET_RESULTS_API.replace(':interviewId', interviewId);

//       const response = await apiConnector(
//         'GET',
//         url,
//         null,
//         {
//           Authorization: `Bearer ${token}`
//         }
//       );

//       if (!response.data.success) {
//         throw new Error(response.data.message);
//       }

//       return response.data.data;
//     } catch (error) {
//       console.error('GET_RESULTS_API ERROR:', error);
//       toast.error(error.response?.data?.message || 'Failed to get results');
//       throw error;
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// }

// services/operations/resultsAPI.js

import { apiConnector } from "../apiConnector";
import { interviewEndpoints } from "../apis";
import { setResults, setLoading, setError } from "../../slices/resultsSlice";
import toast from "react-hot-toast";

const { GET_RESULTS_API } = interviewEndpoints;

// Fetch interview results
export function fetchInterviewResults(interviewId) {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const { token } = getState().auth;

      const url = GET_RESULTS_API.replace(':interviewId', interviewId);
      console.log("Fetching results from:", url);

      const response = await apiConnector(
        "GET",
        url,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("Results API response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch results");
      }

      const data = response.data.data;

      if (!data.results) {
        throw new Error("Results data is missing from API response");
      }

      dispatch(setResults(data));
      return { success: true, data };
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "Failed to fetch results";
      console.error("FETCH_RESULTS ERROR:", message);
      dispatch(setError(message));
      toast.error(message);
      return { success: false, message };
    } finally {
      dispatch(setLoading(false));
    }
  };
}

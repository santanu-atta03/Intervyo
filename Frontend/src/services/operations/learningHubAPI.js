import { apiConnector } from "../apiConnector";
import { setLoading } from "../../slices/profileSlice";
import { BASE_URL } from "../apis";

const LearningHubEndpoints = {
  GET_LEARNING_PROGRESS: `${BASE_URL}/learning-hub/my-learning`,
};

export const getLearningProgress = async (token) => {
  //   const toastId = notify.loading('Scheduling interview...');
  setLoading(true);

  try {
    const response = await apiConnector(
      "GET",
      LearningHubEndpoints.GET_LEARNING_PROGRESS,
      "",
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    );

    if (response.data.success) {
      //   notify.success('Interview scheduled successfully!', { id: toastId });
      console.log("Response : ", response);
      return response.data.data;
    }
  } catch (error) {
    console.error("Fetch learning progress error:", error);
    // notify.error(error.response?.data?.message || 'Failed to schedule interview', {
    //   id: toastId,
    // });
    throw error;
  } finally {
    setLoading(false);
  }
};

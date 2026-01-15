import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { setUser, setLoading } from "../../slices/profileSlice";
const LearningHubEndpoints = {
  GET_LEARNING_PROGRESS:
    "https://intervyo.onrender.com/api/learning-hub/my-learning",
};

export const getLearningProgress = async (token) => {
  //   const toastId = toast.loading('Scheduling interview...');
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
      //   toast.success('Interview scheduled successfully!', { id: toastId });
      console.log("Response : ", response);
      return response.data.data;
    }
  } catch (error) {
    console.error("Fetch learning progress error:", error);
    // toast.error(error.response?.data?.message || 'Failed to schedule interview', {
    //   id: toastId,
    // });
    throw error;
  } finally {
    setLoading(false);
  }
};

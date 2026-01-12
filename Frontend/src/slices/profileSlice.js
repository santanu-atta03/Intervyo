// reducers/profileSlice.js
import { createSlice } from "@reduxjs/toolkit";

let parsedUser = null;
try {
  const storedUser = localStorage.getItem("user");
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.warn("Invalid user data in localStorage, clearing...");
  localStorage.removeItem("user");
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  loading: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Failed to save user to localStorage:", error);
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    updateUserProfilePicture(state, action) {
      if (state.user) {
        state.user.profilePicture = action.payload;
        try {
          localStorage.setItem("user", JSON.stringify(state.user));
        } catch (error) {
          console.error("Failed to update user in localStorage:", error);
        }
      }
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setLoading, updateUserProfilePicture, clearUser } =
  profileSlice.actions;
export default profileSlice.reducer;

import toast from "react-hot-toast";
import CustomToast from "../components/CustomToast.jsx";

export const customToast = {
  success: (message) => {
    toast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="success"
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: "top-right",
      },
    );
  },

  error: (message) => {
    toast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="error"
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: "top-right",
      },
    );
  },

  warning: (message) => {
    toast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="warning"
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: "top-right",
      },
    );
  },

  info: (message) => {
    toast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="info"
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: "top-right",
      },
    );
  },

  loading: (message) => {
    toast.custom(
      (t) => (
        <CustomToast
          message={message}
          type="loading"
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration: 4000,
        position: "top-right",
      },
    );
  },
};

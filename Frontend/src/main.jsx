import "regenerator-runtime/runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./reducer/index.js";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../src/components/shared/ThemeContext";
import { NotificationProvider } from "./components/shared/NotificationContext.jsx";
import { HelmetProvider } from 'react-helmet-async';
const store = configureStore({
  reducer: rootReducer,
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
    <Provider store={store}>
      <BrowserRouter>
      <Toaster position="top-right" />
      <NotificationProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        </NotificationProvider>
        
      </BrowserRouter>
    </Provider>
    </HelmetProvider>
  </StrictMode>
);

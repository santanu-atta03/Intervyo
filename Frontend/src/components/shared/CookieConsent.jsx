import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import { X } from "lucide-react";
import cookieIllustration from "../../assets/cookie_img.png";
import "./CookieConsent.css";

const CONSENT_STORAGE_KEY = "intervyo-cookie-consent";

const essentialPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const preferenceOptions = [
  {
    key: "necessary",
    label: "Necessary cookies",
    description: "Required for core site features and security.",
  },
  {
    key: "analytics",
    label: "Analytics cookies",
    description: "Help us understand how the site is used.",
  },
  {
    key: "marketing",
    label: "Marketing cookies",
    description: "Help us measure and tailor promotional content.",
  },
  {
    key: "functional",
    label: "Functional cookies",
    description: "Remember choices and improve your experience.",
  },
];

function isValidConsent(consent) {
  return (
    consent?.version === 1 &&
    typeof consent.categories?.necessary === "boolean" &&
    typeof consent.categories?.analytics === "boolean" &&
    typeof consent.categories?.marketing === "boolean" &&
    typeof consent.categories?.functional === "boolean"
  );
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(essentialPreferences);
  const [errorMessage, setErrorMessage] = useState("");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (savedConsent) {
        const parsedConsent = JSON.parse(savedConsent);
        if (isValidConsent(parsedConsent)) {
          setPreferences({
            ...parsedConsent.categories,
            necessary: true,
          });
          setIsReady(true);
          return;
        }
      }

      setIsVisible(true);
    } catch (error) {
      console.error("Unable to read cookie consent preferences:", error);
      setErrorMessage(
        "Your preferences could not be loaded. You can still choose an option below.",
      );
      setIsVisible(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const savePreferences = (categories) => {
    const consent = {
      version: 1,
      categories: {
        ...categories,
        necessary: true,
      },
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(consent),
      );
      setPreferences(consent.categories);
      setErrorMessage("");
      setShowPreferences(false);
      setIsVisible(false);
    } catch (error) {
      console.error("Unable to save cookie consent preferences:", error);
      setErrorMessage(
        "We couldn’t save your preferences. Check your browser storage settings and try again.",
      );
    }
  };

  const togglePreference = (key) => {
    if (key === "necessary") return;
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: !currentPreferences[key],
    }));
  };

  return (
    <AnimatePresence>
      {isReady && isVisible && (
        <Motion.section
          className="cookie-consent"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 36 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
          }
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.35 }}
        >
          <button
            type="button"
            className="cookie-consent__close"
            aria-label="Close cookie notice"
            onClick={() => setIsVisible(false)}
          >
            <X size={17} aria-hidden="true" />
          </button>

          <div className="cookie-consent__intro">
            <img
              className="cookie-consent__illustration rounded-full"
              src={cookieIllustration}
              alt=""
              aria-hidden="true"
            />
            <div className="cookie-consent__copy">
              <p className="cookie-consent__eyebrow">Your Privacy Matters</p>
              <h2 id="cookie-consent-title">We Use Cookies</h2>
              <p id="cookie-consent-description">
                We use cookies to improve your browsing experience, understand
                how our website is used, and personalize content. You can
                choose which cookies to allow.
              </p>
            </div>
          </div>

          {showPreferences && (
            <div className="cookie-consent__preferences">
              <h3>Cookie preferences</h3>
              {preferenceOptions.map((option) => (
                <div className="cookie-consent__preference" key={option.key}>
                  <div className="cookie-consent__preference-copy">
                    <span>{option.label}</span>
                    <p>{option.description}</p>
                  </div>
                  <button
                    type="button"
                    className="cookie-consent__switch"
                    role="switch"
                    aria-label={option.label}
                    aria-checked={preferences[option.key]}
                    aria-disabled={option.key === "necessary"}
                    disabled={option.key === "necessary"}
                    onClick={() => togglePreference(option.key)}
                  >
                    <span />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="cookie-consent__save"
                onClick={() => savePreferences(preferences)}
              >
                Save preferences
              </button>
            </div>
          )}

          {errorMessage && (
            <p className="cookie-consent__error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="cookie-consent__actions">
            <button
              type="button"
              className="cookie-consent__accept"
              onClick={() =>
                savePreferences({
                  necessary: true,
                  analytics: true,
                  marketing: true,
                  functional: true,
                })
              }
            >
              Accept All Cookies
            </button>
            <button
              type="button"
              className="cookie-consent__reject"
              onClick={() => savePreferences(essentialPreferences)}
            >
              Reject Non-Essential
            </button>
          </div>

          <button
            type="button"
            className="cookie-consent__customize"
            aria-expanded={showPreferences}
            onClick={() => setShowPreferences((showing) => !showing)}
          >
            {showPreferences ? "Hide Preferences" : "Customize Preferences"}
          </button>
        </Motion.section>
      )}
    </AnimatePresence>
  );
}

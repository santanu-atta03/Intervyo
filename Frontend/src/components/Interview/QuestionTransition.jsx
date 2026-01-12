import { useEffect, useState } from "react";

export default function QuestionTransition({ question }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // reset animation on question change
    setVisible(false);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 150); // small delay = natural pause

    return () => clearTimeout(timer);
  }, [question]);

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-lg font-medium leading-relaxed">
        {question}
      </h2>
    </div>
  );
}

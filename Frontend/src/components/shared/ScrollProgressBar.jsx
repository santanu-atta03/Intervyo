import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const progress =
        (document.documentElement.scrollTop / totalHeight) * 100;

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-3 top-0 h-full w-2 z-[9999] flex items-start">
      <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-full">
        <div
          className="w-full bg-white/70 backdrop-blur-xl rounded-full transition-all duration-150 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
}

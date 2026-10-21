import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const element = document.querySelector(hash);

    if (element) {
      const timeoutId = setTimeout(() => {
        if (window.location.hash !== hash) return;

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [hash]);

  return null;
};

export default ScrollToHash;
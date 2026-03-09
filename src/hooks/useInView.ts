import { useState, useEffect, useRef } from "react";

// Custom hook to detect if element is in viewport
function useInViewport(
  options = {}
): [boolean, React.RefObject<HTMLDivElement | null>] {
  const [isInViewport, setIsInViewport] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Default options for Intersection Observer
    const defaultOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.1, // 10% of element must be visible
      ...options,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsInViewport(entry.isIntersecting);
      });
    }, defaultOptions);
    observer.observe(element);

    // Cleanup observer on unmount
    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [isInViewport, elementRef];
}

export default useInViewport;

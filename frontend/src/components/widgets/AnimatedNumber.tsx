"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // ms
  className?: string;
  formatter?: (num: number) => string;
  delay?: number; // ms before starting
}

export default function AnimatedNumber({
  value,
  duration = 1500,
  className = "",
  formatter = (num) => num.toString(),
  delay = 0,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset animation when value changes
    setHasAnimated(false);
    setDisplayValue(0);

    const startTime = performance.now() + delay;
    const startValue = 0;
    const endValue = value;

    const animate = (time: number) => {
      if (time < startTime) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min((time - startTime) / duration, 1);
      // Ease-out cubic for smooth finish
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setHasAnimated(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [value, duration, delay]);

  return (
    <span className={`${className} ${hasAnimated ? "animated" : ""}`}>
      {formatter(displayValue)}
    </span>
  );
}
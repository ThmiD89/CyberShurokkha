// components/AnimatedNumber.tsx
"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (value === undefined || value === null) return;

    const startTime = performance.now() + delay;
    const startValue = 0;
    const endValue = value;

    const animate = (time: number) => {
      if (time < startTime) {
        requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min((time - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setHasAnimated(true);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      // cleanup if unmount
    };
  }, [value, duration, delay]);

  return (
    <span className={`${className} ${hasAnimated ? "animated" : ""}`}>
      {formatter(displayValue)}
    </span>
  );
}
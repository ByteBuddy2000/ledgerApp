"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
// Lucide icons
import { ShieldCheck, Users, Award, UserPlus } from "lucide-react";

// Counter data with lucide icons
const counters = [
  {
    icon: <ShieldCheck size={48} className="text-indigo-600 mb-4" />,
    value: 869895,
    label: "Secured Assets",
  },
  {
    icon: <Users size={48} className="text-blue-600 mb-4" />,
    value: 87762,
    label: "Satisfied Users",
  },
  {
    icon: <Award size={48} className="text-yellow-500 mb-4" />,
    value: 170294,
    label: "Global Awards",
  },
  {
    icon: <UserPlus size={48} className="text-green-600 mb-4" />,
    value: 887616,
    label: "Registered Users",
  },
];

// Custom hook for count-up effect
function useCountUp(end, duration = 2, start = false) {
  const [count, setCount] = useState(0);
  const frame = useRef();

  useEffect(() => {
    if (!start) return;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        frame.current = requestAnimationFrame(animate);
      }
    };

    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [end, duration, start]);

  return count.toLocaleString();
}

export default function CounterSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [startCounting, setStartCounting] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
      setStartCounting(true);
    }
  }, [inView, controls]);

  return (
    <section ref={ref} className="w-full py-24 relative overflow-hidden">
      {/* Decorative shape centered behind content */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0 opacity-20">
        {/* You can keep or remove this background image as needed */}
      </div>

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
          {counters.map((counter, idx) => {
            const count = useCountUp(counter.value, 2.5, startCounting);
            return (
              <motion.div
                key={counter.label}
                className="flex flex-col items-center bg-gray-50 rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 40 }}
                animate={controls}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
              >
                {counter.icon}
                <h3 className="text-2xl font-extrabold text-indigo-700 mb-1 select-none">
                  {count}
                </h3>
                <p className="text-sm text-gray-600 font-medium text-center">{counter.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
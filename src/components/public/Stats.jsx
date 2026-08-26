"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 11, label: "Years of Celebration" },
  { value: 3, label: "Divine Days" },
  { value: 1000, label: "Devotees & Visitors", suffix: "+" },
  { value: 1, label: "Community. One Family." },
];

function AnimatedCounter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-[var(--font-heading)] text-2xl md:text-3xl text-gold-muted block">
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative z-10 -mt-6 mx-auto w-[min(1100px,88%)] bg-cream-light grid grid-cols-2 md:grid-cols-4 p-5 rounded-xl shadow-[0_14px_40px_rgba(64,36,15,0.13)]"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`text-center py-2 ${
            i < stats.length - 1 ? "md:border-r border-[#eadfc9]" : ""
          } ${i % 2 === 0 && i < 2 ? "border-r border-[#eadfc9] md:border-r" : ""}`}
        >
          <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />
          <span className="text-[0.78rem] text-text-light block mt-1">
            {stat.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET = new Date("2026-09-14T00:00:00+05:30").getTime();

export default function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    function update() {
      const diff = TARGET - Date.now();
      if (diff <= 0) {
        setIsLive(true);
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      let remaining = diff;
      const days = Math.floor(remaining / 86400000);
      remaining %= 86400000;
      const hours = Math.floor(remaining / 3600000);
      remaining %= 3600000;
      const minutes = Math.floor(remaining / 60000);
      remaining %= 60000;
      const seconds = Math.floor(remaining / 1000);
      setTime({ days, hours, minutes, seconds });
    }
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "DAYS", value: time.days },
    { label: "HRS", value: time.hours },
    { label: "MINS", value: time.minutes },
    { label: "SECS", value: time.seconds },
  ];

  return (
    <div className="border border-[var(--line)] bg-panel-dark backdrop-blur-md rounded-xl w-full max-w-[430px] p-4">
      <p className="text-[0.72rem] text-gold-light tracking-widest text-center mb-3 font-semibold">
        {isLive ? "🎉 GANESHOTSAVA 2026 IS HERE" : "CELEBRATION BEGINS IN"}
      </p>
      <div className="grid grid-cols-4">
        {units.map((unit, i) => (
          <div
            key={unit.label}
            className={`text-center ${
              i < 3 ? "border-r border-[rgba(255,255,255,0.15)]" : ""
            }`}
          >
            <motion.span
              key={unit.value}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-[var(--font-heading)] text-2xl md:text-3xl block text-white"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
            <small className="text-[0.58rem] text-muted tracking-wider">
              {unit.label}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

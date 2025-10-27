import { useEffect, useState, useRef } from "react";

export default function Timer({ duration, onTimeUp }) {
  const [time, setTime] = useState(duration);
  const timerRef = useRef(null);

  useEffect(() => {
    // ✅ Run timer only once
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timerRef.current);
  }, [onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 font-semibold">
      Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}

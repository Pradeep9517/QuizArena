import { useEffect, useState, useRef } from "react";

export default function Timer({ duration, onTimeUp }) {
  const [time, setTime] = useState(duration);
  const startRef = useRef(Date.now());
  const frameRef = useRef();

  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const remaining = Math.max(duration - elapsed, 0);
      setTime(remaining);

      if (remaining === 0) {
        onTimeUp();
        cancelAnimationFrame(frameRef.current);
      } else {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [duration, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 font-semibold">
      Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}

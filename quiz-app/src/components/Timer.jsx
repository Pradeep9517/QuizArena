import { useEffect, useState } from "react";

export default function Timer({ duration, onTimeUp }) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 font-semibold">
      Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}

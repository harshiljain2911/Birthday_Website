import { useEffect, useState, useRef } from "react";
import "./Countdown.css";

function Countdown({ onBirthdayReached, birthdayReached }) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [prevTime, setPrevTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Correct ISO format (No space before T)
  const targetDate = useRef(new Date("2026-02-23T00:00:00")).current;

  useEffect(() => {
    if (birthdayReached) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        onBirthdayReached();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setPrevTime(time);
      setTime({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [onBirthdayReached, birthdayReached, time]);

  const Digit = ({ value, label, prevValue }) => {
    const isChanging = value !== prevValue;
    return (
      <div className="digit">
        {/* The 'key' forces React to restart the CSS animation every change */}
        <div className={`card ${isChanging ? "flip" : ""}`} key={value}>
          <div className="text">{String(value).padStart(2, "0")}</div>
        </div>
        <div className="label">{label}</div>
      </div>
    );
  };

  if (birthdayReached) return null; // App.js handles the "Happy Birthday" text

  return (
    <section className="countdown">
      <div className="flip-timer">
        <Digit value={time.hours} label="Hours" prevValue={prevTime.hours} />
        <Digit value={time.minutes} label="Minutes" prevValue={prevTime.minutes} />
        <Digit value={time.seconds} label="Seconds" prevValue={prevTime.seconds} />
      </div>
    </section>
  );
}

export default Countdown;
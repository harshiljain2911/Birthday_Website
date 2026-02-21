import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import Confetti from "./Confetti";
import "./MessageCard.css";

function MessageCard({ isActive, onNext }) {
  const [curtainsOpened, setCurtainsOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevIsActive = useRef(isActive);

  const curtainLeftRef = useRef(null);
  const curtainRightRef = useRef(null);
  const curtainHintRef = useRef(null);
  const messageContentRef = useRef(null);

  const message = `Rajkumari,

On your special day, I just want you to know how much you mean to me.
You didn’t just enter my life — you made it more beautiful, more meaningful, and full of happiness.

Every memory with you is precious to me. Your smile, your innocence, and the way you care… it makes my world brighter every single day.

No matter what life brings, I promise to stand beside you, support you, and protect your smile forever.

I feel lucky to have you.
And today, I celebrate not just your birthday… but the day the most beautiful soul came into this world.

Happy Birthday, my love. 🎉❤️

— Anshul`;

  useEffect(() => {
    if (isActive && !prevIsActive.current) {
      setTimeout(() => setShowConfetti(true), 10);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      prevIsActive.current = isActive;
      return () => clearTimeout(timer);
    }

    if (!isActive && prevIsActive.current) {
      setTimeout(() => {
        setCurtainsOpened(false);
        if (curtainLeftRef.current && curtainRightRef.current) {
          gsap.to([curtainLeftRef.current, curtainRightRef.current], {
            x: "0%",
            opacity: 1,
            rotationY: 0,
            duration: 0.5,
          });
        }
        if (messageContentRef.current) {
          gsap.to(messageContentRef.current, { opacity: 0, scale: 0.9 });
        }
      }, 300);
    }
    prevIsActive.current = isActive;
  }, [isActive]);

  const handleOpenCurtains = () => {
    if (!curtainsOpened) {
      setCurtainsOpened(true);
      const timeline = gsap.timeline();
      
      // 1. Hint ko gayab karo
      timeline.to(curtainHintRef.current, { opacity: 0, duration: 0.3 });
      
      // 2. Parde kholo (105% taaki screen se puri tarah bahar chale jayein)
      timeline.to(curtainLeftRef.current, { x: "-105%", rotationY: -15, duration: 1.5, ease: "power3.inOut" }, 0);
      timeline.to(curtainRightRef.current, { x: "105%", rotationY: 15, duration: 1.5, ease: "power3.inOut" }, 0);
      
      // 3. Message ko smoothly scale aur show karo
      timeline.to(messageContentRef.current, { 
        display: "flex", 
        opacity: 1, 
        scale: 1, 
        duration: 0.8,
        ease: "back.out(1.2)"
      }, 0.5);
    }
  };

  return (
    <section className="message">
      <h2>💌 A Message From My Heart</h2>

      <div className="curtain-container">
        <div className="curtain-rod"></div>
        
        {/* Parda Layer: Khulne ke baad z-index kam ho jayegi taaki message touch ho sake */}
        <div 
          className={`curtain-wrapper ${curtainsOpened ? "opened" : ""}`} 
          onClick={handleOpenCurtains}
          style={{ 
            zIndex: curtainsOpened ? 1 : 10,
            pointerEvents: curtainsOpened ? "none" : "all" 
          }}
        >
          <div ref={curtainLeftRef} className="curtain curtain-left"></div>
          <div ref={curtainRightRef} className="curtain curtain-right"></div>
          {!curtainsOpened && (
            <div ref={curtainHintRef} className="curtain-hint">✨ Click to Open ✨</div>
          )}
        </div>

        {/* Message Layer: Khulne ke baad ye sabse upar aa jayega scroll/click ke liye */}
        <div 
          ref={messageContentRef} 
          className="message-content"
          style={{ 
            opacity: 0, 
            scale: 0.9, 
            zIndex: curtainsOpened ? 20 : 0,
            pointerEvents: curtainsOpened ? "all" : "none" 
          }}
        >
          <div className="message-scroll-box">
             <p className="typed-text">{message}</p>
             {curtainsOpened && (
                <button className="page-nav-btn message-btn" onClick={(e) => {
                  e.stopPropagation(); // Parent click se bachne ke liye
                  onNext();
                }}>
                  📸 View Our Memories
                </button>
              )}
          </div>
        </div>
      </div>

      {showConfetti && <Confetti />}
    </section>
  );
}

export default MessageCard;
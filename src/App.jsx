import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef, useState, useEffect } from "react";
import "./App.css";
import CelebrationPage from "./components/CelebrationPage";
import Countdown from "./components/Countdown";
import Effects from "./components/Effects";
import Gallery from "./components/Gallery";
import Hearts from "./components/Hearts";
import MessageCard from "./components/MessageCard";
import MusicPlayer from "./components/MusicPlayer";

gsap.registerPlugin(ScrollToPlugin);

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Birthday reached state
  const [birthdayReached, setBirthdayReached] = useState(false); 
  const [showEffects, setShowEffects] = useState(false);

  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);
  const musicPlayerRef = useRef(null);

  const goToPage = (pageNumber) => {
    const refs = { 1: page1Ref, 2: page2Ref, 3: page3Ref, 4: page4Ref };
    const currentPageRef = refs[currentPage];
    const nextPageRef = refs[pageNumber];

    const isForward = pageNumber > currentPage;

    // Current page ko exit karwao
    gsap.to(currentPageRef.current, {
      x: isForward ? "-100%" : "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(currentPageRef.current, { visibility: "hidden", position: "absolute" });
      }
    });

    // Next page ki initial state set karo
    gsap.set(nextPageRef.current, {
      x: isForward ? "100%" : "-100%",
      opacity: 0,
      visibility: "visible",
      position: "relative" // Active page relative hona chahiye scroll ke liye
    });

    // Next page ko enter karwao
    gsap.to(nextPageRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.1,
      onComplete: () => {
        setCurrentPage(pageNumber);
        // Page switch hote hi top par scroll kare
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  const handleBirthdayReached = () => {
    setBirthdayReached(true);
    setShowEffects(true);
    setTimeout(() => setShowEffects(false), 10000);
  };

  return (
    <div className="app">
      {/* Persistent Components */}
      <MusicPlayer ref={musicPlayerRef} />
      <Hearts />

      {/* PAGE 1: Countdown Timer */}
      <div
        ref={page1Ref}
        className={`page ${currentPage === 1 ? "active" : ""}`}
        style={{ 
          display: currentPage === 1 ? "flex" : "none",
          visibility: "visible"
        }}
      >
        <section className="hero">
          <h1 id="heroTitle">
            {birthdayReached ? (
              <>Happy Birthday <span className="highlight">Kia</span> 🎂</>
            ) : (
              <>Counting down to <span className="highlight">Kia's</span> special day 🎂</>
            )}
          </h1>
          <p>Your personalized message goes here 💗</p>
        </section>

        <Countdown
          onBirthdayReached={handleBirthdayReached}
          birthdayReached={birthdayReached}
        />

        <section className="teaser">
          <h2 id="teaserHeading">
            {birthdayReached
              ? "💖 Ready for your surprise! 💖"
              : "✨ A special celebration awaits you at midnight... ✨"}
          </h2>
          <p className="teaser-hint">Something magical is about to unfold 💫</p>
        </section>

        <button
          id="surpriseBtn"
          className="celebrate-btn"
          disabled={!birthdayReached}
          onClick={() => goToPage(2)}
        >
          🎀 Let's Celebrate
        </button>
      </div>

      {/* PAGE 2: Celebration */}
      <div 
        ref={page2Ref} 
        className="page" 
        style={{ 
          display: currentPage === 2 ? "flex" : "none",
          visibility: currentPage === 2 ? "visible" : "hidden",
          position: "absolute", 
          top: 0, 
          width: "100%" 
        }}
      >
        <CelebrationPage onComplete={() => goToPage(3)} musicPlayerRef={musicPlayerRef} />
      </div>

      {/* PAGE 3: Message Card */}
      <div 
        ref={page3Ref} 
        className="page" 
        style={{ 
          display: currentPage === 3 ? "flex" : "none",
          visibility: currentPage === 3 ? "visible" : "hidden",
          position: "absolute", 
          top: 0, 
          width: "100%" 
        }}
      >
        <button className="back-btn" onClick={() => goToPage(2)}>← Back</button>
        
        <MessageCard 
          isActive={currentPage === 3} 
          onNext={() => goToPage(4)} 
        />
      </div>

      {/* PAGE 4: Gallery */}
      <div 
        ref={page4Ref} 
        className="page" 
        style={{ 
          display: currentPage === 4 ? "flex" : "none",
          visibility: currentPage === 4 ? "visible" : "hidden",
          position: "absolute", 
          top: 0, 
          width: "100%" 
        }}
      >
        <button className="back-btn" onClick={() => goToPage(3)}>← Back</button>
        <Gallery isActive={currentPage === 4} />
        <section className="final">
          <h2 className="final-message">💖 Forever Yours — Anshul 💖</h2>
        </section>
      </div>

      {showEffects && <Effects />}
    </div>
  );
}

export default App;
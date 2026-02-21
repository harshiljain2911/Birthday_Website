import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Gallery.css";

function Gallery({ isActive }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photosRevealed, setPhotosRevealed] = useState(false);

  const photosRef = useRef([]);
  const lightboxMediaRef = useRef(null);

  const photos = [
    { src: "/images/pic3.jpeg", alt: "Memory 1", type: "image" },
    { src: "/images/pic2.jpeg", alt: "Memory 2", type: "image" },
    { src: "/images/v1.mp4", alt: "Memory 3", type: "video" },
    { src: "/images/pic5.jpeg", alt: "Memory 4", type: "image" },
    { src: "/images/v2.mp4", alt: "Memory 5", type: "video" },
    { src: "/images/pic6.jpeg", alt: "Memory 6", type: "image" },
  ];

  useEffect(() => {
    if (isActive && !photosRevealed) {
      setTimeout(() => setPhotosRevealed(true), 10);

      gsap.fromTo(
        photosRef.current,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.4)",
          delay: 0.2,
        }
      );
    }
  }, [isActive, photosRevealed]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);

    if (lightboxMediaRef.current) {
      gsap.fromTo(
        lightboxMediaRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const showNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % photos.length;
    if (lightboxMediaRef.current) {
      gsap.to(lightboxMediaRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxMediaRef.current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, photos.length]);

  const showPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    if (lightboxMediaRef.current) {
      gsap.to(lightboxMediaRef.current, {
        x: 100,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex(newIndex);
          gsap.fromTo(
            lightboxMediaRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        },
      });
    }
  }, [currentIndex, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrev, closeLightbox]);

  return (
    <section className="gallery">
      <h2>📸 Our Beautiful Memories</h2>
      <div className="photos">
        {photos.map((item, index) => (
          <div 
            key={index} 
            className="media-wrapper"
            ref={(el) => (photosRef.current[index] = el)}
            onClick={() => openLightbox(index)}
          >
            {item.type === "video" ? (
              <video src={item.src} muted loop playsInline className="gallery-item-media" />
            ) : (
              <img src={item.src} alt={item.alt} className="gallery-item-media" loading="lazy" />
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {photos[currentIndex].type === "video" ? (
              <video
                ref={lightboxMediaRef}
                src={photos[currentIndex].src}
                controls
                autoPlay
                loop /* This ensures the video plays in an infinite loop */
                className="lightbox-media"
              />
            ) : (
              <img
                ref={lightboxMediaRef}
                src={photos[currentIndex].src}
                alt={photos[currentIndex].alt}
                className="lightbox-media"
              />
            )}
          </div>
          <button className="lightbox-close" onClick={closeLightbox}>✖</button>
          <button className="nav-btn nav-prev" onClick={(e) => { e.stopPropagation(); showPrev(); }}>‹</button>
          <button className="nav-btn nav-next" onClick={(e) => { e.stopPropagation(); showNext(); }}>›</button>
        </div>
      )}
    </section>
  );
}

export default Gallery;
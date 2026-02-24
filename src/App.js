import { useEffect, useRef, useState } from "react";
import "./index.css";

function App() {
  const heroRef = useRef(null);
  const scaleRef = useRef(1);
  const wheelAccumRef = useRef(0);
  const zoomOutAccumRef = useRef(0);
  const [entered, setEntered] = useState(false);
  const [zoomingOut, setZoomingOut] = useState(false);

  const notchSize = 150;
  const zoomStep = 4.5;
  const triggerZoom = 9112;

  useEffect(() => {
    const hero = heroRef.current;
    const g = hero?.querySelector(".g");

    if (hero && g) {
      const heroRect = hero.getBoundingClientRect();
      const gRect = g.getBoundingClientRect();
      const originX =
        ((gRect.left - heroRect.left + gRect.width / 2) / heroRect.width) * 100;
      hero.style.transformOrigin = `${originX}% 50%`;
    }

    const handleWheel = (e) => {
      // =========================
      // 🔥 ZOOM OUT (top of real page, scroll up)
      // =========================
      if (entered && window.scrollY === 0 && e.deltaY < 0) {
        e.preventDefault();

        zoomOutAccumRef.current += e.deltaY * -4.5;

        if (Math.abs(zoomOutAccumRef.current) >= notchSize) {
          scaleRef.current /= zoomStep;
          scaleRef.current = Math.max(1, scaleRef.current);

          if (heroRef.current) {
            heroRef.current.style.transform = `scale(${scaleRef.current.toFixed(3)})`;
          }

          // Disappear real page precisely after first step from 9112.5%
          if (scaleRef.current * 100 < 9112.5) {
            setZoomingOut(true);
          }

          // Fully zoomed out — back to hero
          if (scaleRef.current < 1.001) {
            setEntered(false);
            setZoomingOut(false);
            window.scrollTo(0, 0);
          }

          zoomOutAccumRef.current = 0;
        }
        return;
      }

      // Reset zoomingOut if user scrolls down again
      if (entered && e.deltaY > 0 && zoomingOut) {
        setZoomingOut(false);
      }

      // =========================
      // 🔥 ZOOM IN (hero mode)
      // =========================
      if (!entered) {
        e.preventDefault();
        wheelAccumRef.current += e.deltaY * 4.5;

        if (Math.abs(wheelAccumRef.current) >= notchSize) {
          const dir = Math.sign(wheelAccumRef.current);
          scaleRef.current *= Math.pow(zoomStep, dir);
          scaleRef.current = Math.max(1, scaleRef.current);

          if (heroRef.current) {
            heroRef.current.style.transform = `scale(${scaleRef.current.toFixed(3)})`;
          }

          if (scaleRef.current * 100 >= triggerZoom) {
            setEntered(true);
            setTimeout(() => window.scrollTo(0, 1), 50);
          }

          wheelAccumRef.current = 0;
        }
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, [entered, zoomingOut]);

  return (
    <>
      {/* Hero: ALWAYS in DOM so heroRef never goes null */}
      <div className={`hero ${entered && !zoomingOut ? "hero-hidden" : ""}`}>
        <h1 ref={heroRef} className="name">
          Priyanshu <span className="g">G</span>autam
        </h1>
      </div>

      {/* Real page: disappears instantly after 9112.5% on zoom-out */}
      {entered && !zoomingOut && (
        <div className="real-page">
          <section>
            <h1>Welcome 🚀</h1>
            <p>Scroll to the very top and scroll up to zoom back out.</p>
          </section>
          <section>
            <h2>Projects</h2>
            <p>Your projects here.</p>
          </section>
          <section>
            <h2>Skills</h2>
            <p>More content here.</p>
          </section>
        </div>
      )}
    </>
  );
}

export default App;

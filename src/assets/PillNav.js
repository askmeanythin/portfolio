import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./PillNav.css";

const PillNav = ({
  logo,
  logoAlt = "Logo",
  items = [],
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const logoRef = useRef(null);
  const navItemsRef = useRef(null);

  useEffect(() => {
    circleRefs.current.forEach((circle, i) => {
      if (!circle?.parentElement) return;

      const pill = circle.parentElement;
      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;

      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta =
        Math.ceil(
          R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))
        ) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const label = pill.querySelector(".pill-label");
      const white = pill.querySelector(".pill-label-hover");

      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, duration: 0.4, ease }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 0.4, ease }, 0);
      }

      if (white) {
        gsap.set(white, { y: h + 12, opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 0.4, ease }, 0);
      }

      tlRefs.current[i] = tl;
    });

    if (initialLoadAnimation) {
      gsap.fromTo(logoRef.current, { scale: 0 }, { scale: 1, duration: 0.5 });
      gsap.fromTo(navItemsRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }
  }, [items]);

  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor
  };

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} style={cssVars}>
        <div className="pill-logo" ref={logoRef}>
          {logo && <img src={logo} alt={logoAlt} />}
        </div>

        <div className="pill-nav-items" ref={navItemsRef}>
          <ul className="pill-list">
            {items.map((item, i) => (
              <li key={i}>
                <button
                  type="button"
                  className="pill"
                  onClick={item.onClick}
                  onMouseEnter={() => tlRefs.current[i]?.play()}
                  onMouseLeave={() => tlRefs.current[i]?.reverse()}
                >
                  <span
                    className="hover-circle"
                    ref={(el) => (circleRefs.current[i] = el)}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default PillNav;
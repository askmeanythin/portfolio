import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

import PillNav from "./assets/PillNav";
import ClickSpark from "./assets/ClickSpark";
import LogoLoop from "./assets/LogoLoop";
import StarBorder from "./assets/StarBorder";
import GradientText from "./assets/GradientText"; // ✅ new
import thmLogo from "./assets/tryhackme.svg";
import htbLogo from "./assets/HTB.webp";
import logo from "./assets/check.png";
import TextType from "./assets/TextType";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiGithub,
  SiLinkedin
} from "react-icons/si";

import { MdEmail } from "react-icons/md";

function App() {
  const heroRef = useRef(null);

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  const scaleRef = useRef(1);
  const wheelAccumRef = useRef(0);
  const zoomOutAccumRef = useRef(0);

  const scrollTimerRef = useRef(null);
  const isAutoScrollingRef = useRef(false);

  const [entered, setEntered] = useState(false);
  const [zoomingOut, setZoomingOut] = useState(false);

  const notchSize = 150;
  const zoomStep = 4.5;
  const triggerZoom = 9112;

  // ================= LOGO DATA =================
  const techLogos = [
    { node: <SiGithub color="black" />, title: "Github", href: "https://github.com/askmeanythin" },
    { node: <SiLinkedin color="black" />, title: "Linkedin", href: "https://www.linkedin.com/in/priyanshu-gautam06/" },
    { node: <img src={thmLogo} alt="TryHackMe" style={{ height: "40px" }} />, title: "TryHackMe", href: "https://tryhackme.com/p/priya.x" },
    { node: <img src={htbLogo} alt="HackTheBox" style={{ height: "40px" }} />, title: "Hack The Box", href: "https://profile.hackthebox.com/profile/019c999b-6339-719a-ba8a-26fefc465ada" },
    { node: <SiReact color="black" />, title: "React", hidden: true },
    { node: <SiNextdotjs color="black" />, title: "Next.js", hidden: true },
    { node: <SiTypescript color="black" />, title: "TypeScript", hidden: true },
    { node: <SiTailwindcss color="black" />, title: "Tailwind CSS", hidden: true }
  ];

  // ================= PROJECTS DATA =================
  const projects = [
    {
      name: "Smart Surveillance System (AI/ML-Based CCTV Platform)",
      description: "Developed a real-time AI-powered surveillance system using TensorFlow, OpenCV, and MediaPipe to perform face recognition, suspicious activity detection, and vehicle speed monitoring with 85%+ accuracy. Optimized deep learning inference for edge devices, reducing latency by 40% while maintaining 30+ FPS performance.",
    },
    {
      name: "AI Task Automation System (LLM Integration)",
      description: "Built an automated AI workflow system integrating locally fine-tuned LLMs (Phi-3.5, Qwen) via Ollama for intelligent task execution and process automation. Engineered API integrations with Google Services (Gmail, Docs, Forms, Meet) to enable seamless automated data handling.",
    },
  ];

  // ================= NAVIGATION =================
  const scrollToSection = (section) => {
    const map = {
      about: aboutRef,
      services: servicesRef,
      contact: contactRef
    };

    map[section]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleNavClick = (section) => {
    if (section === "home") {
      scaleRef.current = 1;
      wheelAccumRef.current = 0;
      zoomOutAccumRef.current = 0;

      if (heroRef.current) {
        heroRef.current.style.transform = "scale(1)";
      }

      setEntered(false);
      setZoomingOut(false);

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!entered) {
      scaleRef.current = 91.125;
      heroRef.current.style.transform = `scale(${scaleRef.current})`;
      setEntered(true);

      setTimeout(() => scrollToSection(section), 100);
    } else {
      scrollToSection(section);
    }
  };

  // ================= ZOOM SYSTEM =================
  useEffect(() => {
    const hero = heroRef.current;
    const g = hero?.querySelector(".g");

    if (hero && g) {
      const heroRect = hero.getBoundingClientRect();
      const gRect = g.getBoundingClientRect();
      const originX =
        ((gRect.left - heroRect.left + gRect.width / 2) /
          heroRect.width) *
        100;
      hero.style.transformOrigin = `${originX}% 50%`;
    }

    const isMobile = window.innerWidth <= 768;

    const handleWheel = (e) => {
      if (isMobile) return;

      if (entered && window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault();

        zoomOutAccumRef.current += e.deltaY * -4;

        if (Math.abs(zoomOutAccumRef.current) >= notchSize) {
          scaleRef.current /= zoomStep;
          scaleRef.current = Math.max(1, scaleRef.current);

          heroRef.current.style.transform =
            `scale(${scaleRef.current.toFixed(3)})`;

          if (scaleRef.current < 1.05) {
            setEntered(false);
            setZoomingOut(false);
            window.scrollTo(0, 0);
          }

          zoomOutAccumRef.current = 0;
        }

        return;
      }

      if (!entered) {
        e.preventDefault();
        wheelAccumRef.current += e.deltaY * 4;

        if (Math.abs(wheelAccumRef.current) >= notchSize) {
          const dir = Math.sign(wheelAccumRef.current);

          scaleRef.current *= Math.pow(zoomStep, dir);
          scaleRef.current = Math.max(1, scaleRef.current);

          heroRef.current.style.transform =
            `scale(${scaleRef.current.toFixed(3)})`;

          if (scaleRef.current * 100 >= triggerZoom) {
            setEntered(true);
            setTimeout(() => window.scrollTo(0, 1), 50);
          }

          wheelAccumRef.current = 0;
        }
      }
    };

    let touchStartY = 0;
    let touchDelta = 0;

    const mobileZoomStep = 2.8;
    const mobileTrigger = 3200;
    const mobileThreshold = 25;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!isMobile) return;

      const currentY = e.touches[0].clientY;
      touchDelta = touchStartY - currentY;

      if (!entered && touchDelta > mobileThreshold) {
        scaleRef.current *= mobileZoomStep;
        scaleRef.current = Math.min(scaleRef.current, 35);

        heroRef.current.style.transform =
          `scale(${scaleRef.current.toFixed(3)})`;

        if (scaleRef.current * 100 >= mobileTrigger) {
          setEntered(true);
          setTimeout(() => window.scrollTo(0, 1), 50);
        }

        touchStartY = currentY;
      }

      if (entered && window.scrollY <= 0 && touchDelta < -mobileThreshold) {
        scaleRef.current /= mobileZoomStep;
        scaleRef.current = Math.max(1, scaleRef.current);

        heroRef.current.style.transform =
          `scale(${scaleRef.current.toFixed(3)})`;

        if (scaleRef.current <= 1.05) {
          setEntered(false);
          setZoomingOut(false);
          window.scrollTo(0, 0);
        }

        touchStartY = currentY;
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [entered]);

  // ================= AUTO CENTER SECTIONS =================
  useEffect(() => {
    if (!entered) return;

    const tryAutoScroll = (ref, factor) => {
      const el = ref.current;
      if (!el) return false;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visibleAmount =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const visibleRatio = visibleAmount / rect.height;

      if (visibleRatio > 0.6 && visibleRatio < 1.0) {
        isAutoScrollingRef.current = true;

        const absoluteTop = rect.top + window.scrollY;
        const elementCenter = absoluteTop + rect.height / 2;

        window.scrollTo({
          top: elementCenter - window.innerHeight * factor,
          behavior: "smooth",
        });

        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 800);

        return true;
      }
      return false;
    };

    const handleScroll = () => {
      if (isAutoScrollingRef.current) return;

      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        if (tryAutoScroll(aboutRef, 0.52)) return;
        tryAutoScroll(servicesRef, 0.6);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimerRef.current);
    };
  }, [entered]);

  return (
    <ClickSpark sparkColor="#000" sparkSize={10} sparkRadius={20} sparkCount={10} duration={500}>
      <>
        <Analytics />
        {/* HERO */}
        <div className={`hero ${entered && !zoomingOut ? "hero-hidden" : ""}`}>
          <h1 ref={heroRef} className="name">
            Priyanshu <span className="g">G</span>autam
          </h1>

          {!entered && (
            <div
              style={{
                position: "absolute",
                bottom: "60px",
                width: "100%",
                height: "120px",
                overflow: "hidden"
              }}
            >
              <LogoLoop
                logos={techLogos.filter(logo => !logo.hidden)}
                speed={100}
                direction="left"
                logoHeight={45}
                gap={60}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#ffffff"
              />
            </div>
          )}
        </div>

        {/* SECOND PAGE */}
        {entered && (
          <div className="real-page">
            <PillNav
              logo={logo}
              logoAlt="Company Logo"
              items={[
                { label: "Home", onClick: () => handleNavClick("home") },
                { label: "About", onClick: () => handleNavClick("about") },
                { label: "Services", onClick: () => handleNavClick("services") },
                { label: "Contact", onClick: () => handleNavClick("contact") }
              ]}
              className="custom-nav"
              ease="power2.out"
              baseColor="#000000"
              pillColor="#ffffff"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#000000"
              initialLoadAnimation={false}
            />

            {/* ABOUT */}
            <section ref={aboutRef} className="section about-section">
              <div className="about-container">
                <h1 className="about-title">
                  Hi, I'm{" "}
                  {/* ✅ GradientText wrapping name — black/white/grey theme */}
                  <GradientText
                    colors={["#000000", "#554c4c", "#766262", "#4b3d3d", "#000000"]}
                    animationSpeed={2}
                    showBorder={false}
                    className="about-name-gradient"
                  >
                    Priyanshu Gautam
                  </GradientText>
                </h1>

                <p className="about-text">
                  I'm a Computer Science student currently pursuing my B.Tech at
                  <span className="inline-pill">VIT Vellore</span>, with a strong interest in
                  <span className="inline-pill">Cybersecurity & Ethical Hacking</span>.
                </p>

                <p className="about-text">
                  I'm naturally <span className="inline-pill">curious</span> about how systems operate beneath the surface.
                  I actively practice on platforms like TryHackMe and Hack The Box,
                  constantly <span className="inline-pill">challenging myself</span> with real-world scenarios.
                  I <span className="inline-pill">enjoy</span> breaking complex problems down
                  and understanding how to secure them effectively.
                </p>

                <p className="about-text">
                  Beyond security, I <span className="inline-pill">love building</span>
                  interactive web experiences like this portfolio.
                  I'm deeply involved in the entire creation process — designing structure,
                  debugging issues, refining interactions, and improving performance step by step.
                </p>

                <p className="about-text">
                  My <span className="inline-pill">aim</span> is to grow into a security-focused engineer
                  who not only identifies vulnerabilities but designs resilient systems from the ground up.
                </p>
              </div>
            </section>

            {/* SERVICES */}
            <section ref={servicesRef} className="section services-section">
              <h1 className="section-title">Services</h1>
              <div className="projects-grid">
                {projects.map((project, index) => (
                  <StarBorder
                    key={index}
                    as="div"
                    color="#8A8080"
                    speed="2s"
                    className="project-card-outer"
                    onClick={() => console.log(`Clicked: ${project.name}`)}
                  >
                    <div className="project-card-inner">
                      <h2 className="project-name">{project.name}</h2>
                      <p className="project-desc">{project.description}</p>
                    </div>
                  </StarBorder>
                ))}
              </div>
            </section>

            {/* CONTACT */}
            <section ref={contactRef} className="section contact-section">
              <TextType
                text={["Contact Me", "Open to Opportunities"]}
                typingSpeed={75}
                deletingSpeed={50}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
                className="contact-heading"
              />

              <div className="contact-icons">
                <a
                  href="mailto:priyanshu20012006@gmail.com"
                  className="contact-icon-link"
                  title="Gmail"
                >
                  <MdEmail />
                </a>

                <a
                  href="https://www.linkedin.com/in/priyanshu-gautam06/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-icon-link"
                  title="LinkedIn"
                >
                  <SiLinkedin />
                </a>

                <a
                  href="https://github.com/askmeanythin"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-icon-link"
                  title="GitHub"
                >
                  <SiGithub />
                </a>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
              Made with ❤️ by Priyanshu
            </footer>

          </div>
        )}
      </>
    </ClickSpark>
  );
}

export default App;

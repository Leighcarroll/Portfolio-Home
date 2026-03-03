import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  {
    id: 1,
    title: "Ecommerce Template Design",
    subtitle: "Sass Architecture & Legacy Redesign",
    tags: ["E-Commerce", "Sass", "Frontend"],
    desc: "Adding custom Sass architecture to redesign legacy websites with a fully customisable, modern template system.",
    highlights: ["Easily customisable Sass template", "Legacy platform compliance", "Technical problem solving"],
    url: "https://leighcarroll.us/i/ecommerce-template", year: "2025", emoji: "⚓",
  },
  {
    id: 2,
    title: "Tröbnitzer Getränkehandel",
    subtitle: "B2B E-Commerce Platform",
    tags: ["E-Commerce", "B2B UX", "German Market"],
    desc: "A full-featured B2B wholesale beverage platform serving gastronomy and trade clients across Thuringia. Designed for bulk ordering, repeat purchases, and efficient account management.",
    highlights: ["Custom B2B account portal", "Wishlist & repeat-order UX", "Category-driven navigation", "Mobile-first responsive layout"],
    url: "https://leighcarroll.us/i/legacy-shop-redesign", year: "2026", emoji: "🍺",
  },
  {
    id: 3,
    title: "Four Roots Collective",
    subtitle: "Branding & Landing Page",
    tags: ["Branding", "Logo Design", "Web Design"],
    desc: "Logo, branding guidelines, and landing page design for an eating disorder therapy group.",
    highlights: ["Custom logo built with customer feedback", "Branding for long-term use and growth", "Targeted SEO and content for website landing page"],
    url: "https://leighcarroll.us/i/four-roots-collective", year: "2024", emoji: "🌳",
  },
  {
    id: 4,
    title: "TempoCare",
    subtitle: "UX/UI App Design — IronHack Bootcamp",
    tags: ["UX Research", "UI Design", "Figma"],
    desc: "A supplemental app concept created during an IronHack UX Bootcamp, designed to bring extra value to health insurance customers.",
    highlights: ["UX research — primary and secondary", "UI design and components", "Figma prototyping and testing"],
    url: "https://leighcarroll.us/i/tempocare", year: "2024", emoji: "🩹",
  },
  {
    id: 5,
    title: "Prosumio",
    subtitle: "UX Project — IronHack Bootcamp",
    tags: ["Gamification", "UX/UI", "Sustainability"],
    desc: "In August 2023 I worked with the Prosumio team based out of Berlin on a UX project as part of the IronHack UX/UI Bootcamp. Prosumio is a game teaching teenagers environmental activism and sustainable behaviours.",
    highlights: ["Gamification", "UI design and brand research", "Game testing"],
    url: "https://leighcarroll.us/i/prosumio", year: "2023", emoji: "🌍",
  },
  {
    id: 6,
    title: "Marley Spoon",
    subtitle: "Graphic Design & Creative Direction",
    tags: ["Graphic Design", "Creative Direction", "Print & Web"],
    desc: "Graphic design and creative direction work for Marley Spoon brands.",
    highlights: ["Photographic direction and brainstorming", "Graphic design", "Print and web design"],
    url: "https://leighcarroll.us/i/marley-spoon-brands", year: "2022", emoji: "🥗",
  },
];

const ACCENT = "#C4DEE3";
const BG = "#f8fafb";
const DARK = "#1a1f2e";

function useMousePos() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const h = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

function useFadeIn(ref) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return vis;
}

function FadeSection({ children, style = {}, delay = 0 }) {
  const ref = useRef();
  const vis = useFadeIn(ref);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      ...style
    }}>{children}</div>
  );
}

function StarCursor({ pos }) {
  const [trail, setTrail] = useState([]);
  useEffect(() => { setTrail(t => [...t.slice(-10), pos]); }, [pos]);

  const starPath = (() => {
    const pts = [], n = 7, outer = 12, inner = 5;
    for (let i = 0; i < n * 2; i++) {
      const angle = (Math.PI / n) * i - Math.PI / 2;
      const r = i % 2 === 0 ? outer : inner;
      pts.push(`${12 + r * Math.cos(angle)},${12 + r * Math.sin(angle)}`);
    }
    return `M${pts.join("L")}Z`;
  })();

  const starColor = "#7aadb5";
  return (
    <>
      {trail.map((p, i) => (
        <svg key={i} style={{
          position: "fixed", left: p.x, top: p.y, pointerEvents: "none", zIndex: 9999,
          transform: "translate(-50%,-50%)",
          opacity: (i / trail.length) * 0.22,
          width: 8 + i * 1.3, height: 8 + i * 1.3,
        }} viewBox="0 0 24 24">
          <path d={starPath} fill={starColor} />
        </svg>
      ))}
      <svg style={{
        position: "fixed", left: pos.x, top: pos.y, pointerEvents: "none", zIndex: 9999,
        transform: "translate(-50%,-50%)",
        transition: "left 0.07s, top 0.07s",
        width: 26, height: 26,
      }} viewBox="0 0 24 24">
        <path d={starPath} fill={starColor} />
      </svg>
    </>
  );
}

function HeroCanvas() {
  const canvasRef = useRef();
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth;
    let h = c.height = c.offsetHeight;
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT + "99"; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(196,222,227,${0.18 * (1 - d / 130)})`;
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    const ro = new ResizeObserver(() => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; });
    ro.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }} />;
}

function ProjectCard({ p, index }) {
  const [hov, setHov] = useState(false);
  const ref = useRef();
  const vis = useFadeIn(ref);

  return (
    <a ref={ref} href={p.url || "#"} target="_parent" rel="noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ textDecoration: "none", display: "block",

      opacity: vis ? 1 : 0,
      transform: vis ? (hov ? "translateY(-6px)" : "translateY(0)") : "translateY(32px)",
      transition: `opacity 0.7s ease ${index * 80}ms, transform 0.5s cubic-bezier(.4,0,.2,1)`,
      background: "#fff",
      border: `1.5px solid ${hov ? ACCENT : "#e8edf0"}`,
      borderRadius: 16, padding: "32px 28px", cursor: "default",
      boxShadow: hov ? `0 16px 48px ${ACCENT}44` : "0 2px 12px #0000000a",
    }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>{p.emoji}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {p.tags.map(t => (
            <span key={t} style={{
              background: `${ACCENT}33`, color: "#233b3f",
              borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: 700, letterSpacing: 0.5
            }}>{t}</span>
          ))}
        </div>
        <span style={{ color: "#36585e", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>{p.year}</span>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: DARK, margin: "0 0 10px", letterSpacing: -0.3 }}>{p.title}</h3>
      <p style={{ color: "#5c696b", fontSize: 14, lineHeight: 1.75, margin: "0 0 20px" }}>{p.desc}</p>
      <ul style={{ padding: 0, margin: "0 0 24px", listStyle: "none" }}>
        {p.highlights.map(h => (
          <li key={h} style={{ color: "#8fa5a9", fontSize: 13, padding: "3px 0", display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: ACCENT, fontSize: 14, fontWeight: 900 }}>—</span> {h}
          </li>
        ))}
      </ul>
      {p.url && (
        <a href={p.url} target="_blank" rel="noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "#4a7a82", fontWeight: 700, fontSize: 13, textDecoration: "none",
          borderBottom: `1.5px solid ${ACCENT}`, paddingBottom: 2,
          transition: "color 0.2s", letterSpacing: 0.3
        }}>View Project ↗</a>
      )}
    </a>
  );
}

export default function Portfolio() {
  const mouse = useMousePos();
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(document.body.scrollHeight, '*');
    };
    sendHeight();
    window.addEventListener('resize', sendHeight);
    return () => window.removeEventListener('resize', sendHeight);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: DARK, overflowX: "hidden" }}>
      <StarCursor pos={mouse} />

      {/* HERO */}
      <section id="home" style={{ width: "100%", height: "450", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 60 }}>
        <HeroCanvas />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 55% 55%, ${ACCENT}18 0%, transparent 65%)` }} />
        <div style={{ textAlign: "center", zIndex: 1, padding: "0 24px", maxWidth: 760 }}>
          <FadeSection delay={0}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 32, color: "#7a9fa5", fontSize: 12, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6fc18a", display: "inline-block", boxShadow: "0 0 8px #6fc18a" }} />
              Available for projects
            </div>
          </FadeSection>
          <FadeSection delay={150}>
            <h1 style={{
              fontSize: "clamp(2.8rem,7vw,5.5rem)", fontWeight: 900,
              lineHeight: 1.05, margin: "0 0 28px", color: DARK, letterSpacing: -2
            }}>
              Crafting digital<br />
              <span style={{ color: ACCENT, WebkitTextStroke: `2px ${ACCENT}`, WebkitTextFillColor: "transparent" }}>experiences</span>
            </h1>
          </FadeSection>
          <FadeSection delay={300}>
            <p style={{ color: "#8fa5a9", fontSize: 17, lineHeight: 1.8, marginBottom: 44, maxWidth: 480, margin: "0 auto 44px" }}>
              Website, branding, UX/UI - focus on e-commerce and B2B.
            </p>
          </FadeSection>
          <FadeSection delay={450}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("work")} style={{
                background: DARK, border: "none", color: "#fff",
                fontWeight: 700, fontSize: 14, padding: "13px 30px", borderRadius: 10, cursor: "pointer",
                letterSpacing: 0.3, transition: "all 0.25s"
              }}
                onMouseEnter={e => { e.target.style.background = "#2d3748"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = DARK; e.target.style.transform = "none"; }}
              >View my work</button>
              <button onClick={() => scrollTo("contact")} style={{
                background: "none", border: `1.5px solid ${ACCENT}`, color: "#4a7a82",
                fontWeight: 700, fontSize: 14, padding: "13px 30px", borderRadius: 10, cursor: "pointer",
                letterSpacing: 0.3, transition: "all 0.25s"
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${ACCENT}22`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.transform = "none"; }}
              >Get in touch</button>
            </div>
          </FadeSection>
        </div>
        {/* <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#b8cdd0", fontSize: 11, fontWeight: 600, letterSpacing: 2 }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${ACCENT}, transparent)`, animation: "pulse 2s infinite" }} />
        </div> */}
      </section>

      {/* WORK */}
      <section id="work" style={{ padding: "110px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <FadeSection>
          <div style={{ marginBottom: 56 }}>
            <span style={{ color: "#b0c8cc", fontWeight: 700, fontSize: 11, letterSpacing: 3 }}>SELECTED WORK</span>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, margin: "10px 0 0", color: DARK, letterSpacing: -1 }}>Projects</h2>
          </div>
        </FadeSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,480px),1fr))", gap: 24 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "110px 24px 120px", background: "#fff", borderTop: "1px solid #edf1f2" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <FadeSection>
            <span style={{ color: "#b0c8cc", fontWeight: 700, fontSize: 11, letterSpacing: 3 }}>CONTACT</span>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, margin: "10px 0 16px", color: DARK, letterSpacing: -1 }}>Let's work together</h2>
            <p style={{ color: "#8fa5a9", fontSize: 16, lineHeight: 1.8, marginBottom: 48 }}>
              Have a project in mind? I'd love to hear about it.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
              {[["📧", "hello@alex.dev"], ["💼", "LinkedIn"], ["🐙", "GitHub"]].map(([icon, label]) => (
                <div key={label} style={{
                  background: BG, border: `1.5px solid #e8edf0`, borderRadius: 12,
                  padding: "14px 24px", display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer", transition: "all 0.25s", fontSize: 14, fontWeight: 600, color: "#5a7a80"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${ACCENT}33`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8edf0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
            <a href="mailto:hello@alex.dev" style={{
              display: "inline-block", background: DARK, color: "#fff",
              fontWeight: 700, fontSize: 15, padding: "14px 40px",
              borderRadius: 10, textDecoration: "none", letterSpacing: 0.3,
              transition: "all 0.25s"
            }}
              onMouseEnter={e => { e.target.style.background = "#2d3748"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = DARK; e.target.style.transform = "none"; }}
            >Send a message →</a>
          </FadeSection>
        </div>
      </section>



      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  );
}

import { useEffect, useRef } from "react";

/**
 * Particle cursor trail — neutral gray, moves-only, self-fading traces
 */
export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Neutral gray particle color
    const [tr, tg, tb] = [128, 128, 128];

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let lastX = mx;
    let lastY = my;
    let moving = false;
    let idleTimer: number | null = null;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const dx = Math.abs(mx - lastX);
      const dy = Math.abs(my - lastY);
      if (dx > 1 || dy > 1) {
        moving = true;
        lastX = mx;
        lastY = my;
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => {
          moving = false;
        }, 100);
      }
    };
    window.addEventListener("mousemove", onMove);

    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number };
    const particles: P[] = [];

    let raf = 0;
    const tick = () => {
      if (moving) {
        for (let i = 0; i < 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.6 + 0.1;
          particles.push({
            x: mx,
            y: my,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.2,
            life: 0,
            max: 40 + Math.random() * 30,
            size: Math.random() * 2 + 0.8,
          });
        }
      }

      // Fade traces gradually
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.globalCompositeOperation = "source-over";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.005;

        const alpha = 1 - p.life / p.max;
        if (alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${tr}, ${tg}, ${tb}, ${alpha * 0.9})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${tr}, ${tg}, ${tb}, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      aria-hidden
    />
  );
}

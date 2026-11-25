import { useEffect, useRef } from 'react';

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; z: number; size: number; baseAlpha: number }[] = [];
    const numStars = 1200;

    const populateStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width * 2 - width,
          y: Math.random() * height * 2 - height,
          z: Math.random() * 1000,
          size: Math.random() * 1.2 + 0.3,
          baseAlpha: Math.random() * 0.8 + 0.2,
        });
      }
    };

    populateStars();

    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let time = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    let lastMouseEvent = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseEvent < 16) return; // throttle to ~60Hz without changing visual timing
      lastMouseEvent = now;
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;

    let isPaused = false;
    const handleVisibility = () => {
      isPaused = document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    handleVisibility();

    const render = () => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.005;
      scrollY += (targetScrollY - scrollY) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.15;
      mouseY += (targetMouseY - mouseY) * 0.15;

      ctx.fillStyle = 'rgba(5, 5, 7, 0.4)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      const eventHorizon = 24;
      const lensingRadius = 190;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        let currentZ = star.z - scrollY * 0.8 - time * 50;

        while (currentZ < 1) currentZ += 1000;
        while (currentZ > 1000) currentZ -= 1000;

        const k = 1000 / currentZ;
        let px = star.x * k + cx;
        let py = star.y * k + cy;
        let pSize = star.size * k * 0.6;
        let alpha = star.baseAlpha * Math.min(1, currentZ / 200) * Math.min(1, (1000 - currentZ) / 200);

        const dx = px - mouseX;
        const dy = py - mouseY;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < lensingRadius && dist > 1) {
          const force = Math.pow((lensingRadius - dist) / lensingRadius, 2);
          const angle = Math.atan2(dy, dx);
          const swirl = force * 0.8;

          let pushOut = 0;
          if (dist < eventHorizon * 1.5) {
            pushOut = (eventHorizon * 1.5 - dist) * 0.8;
          }

          px += Math.cos(angle + swirl) * pushOut + Math.cos(angle + Math.PI / 2) * (force * 60);
          py += Math.sin(angle + swirl) * pushOut + Math.sin(angle + Math.PI / 2) * (force * 60);

          if (dist < eventHorizon * 2.5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.72})`;
            pSize *= 1.5;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          }
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }

        if (dist > eventHorizon * 0.8) {
          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const gradient = ctx.createRadialGradient(mouseX, mouseY, eventHorizon * 0.8, mouseX, mouseY, eventHorizon * 2.5);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.24)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.08)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, eventHorizon * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, eventHorizon * 0.95, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    let resizeTimeout: number | undefined;
    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        populateStars();
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#020203' }}
    />
  );
}

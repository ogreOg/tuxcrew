import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CursorDot() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if device supports hover
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') || 
        target.closest('textarea') || 
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden sm:block"
      animate={{
        x: pos.x - (isHovering ? 16 : 4),
        y: pos.y - (isHovering ? 16 : 4),
        width: isHovering ? 32 : 8,
        height: isHovering ? 32 : 8,
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
    >
      <div className="w-full h-full bg-white rounded-full opacity-80" />
    </motion.div>
  );
}

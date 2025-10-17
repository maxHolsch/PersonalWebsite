'use client';

import { useState, useRef } from 'react';

interface RippleTextProps {
  text: string;
}

export default function RippleText({ text }: RippleTextProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!textRef.current) return;

    const rect = textRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x, y });
  };

  return (
    <span
      ref={textRef}
      className="inline-block relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ cursor: 'default', padding: '0 20px', margin: '0 -20px' }}
    >
      {/* Base black text - always visible */}
      <span style={{ color: 'black' }}>
        {text}
      </span>

      {/* Ripple gradient overlay */}
      {isHovering && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              radial-gradient(
                circle at ${mousePos.x}% ${mousePos.y}%,
                rgba(255, 255, 255, 0.5) 0%,
                rgba(255, 255, 255, 0.3) 15%,
                rgba(255, 255, 255, 0.18) 25%,
                rgba(255, 255, 255, 0.1) 35%,
                transparent 50%
              )
            `,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

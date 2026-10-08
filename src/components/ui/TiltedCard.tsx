"use client";

import React, { useRef, useState } from "react";

interface TiltedCardProps {
  imageSrc: string;
  alt: string;
  className?: string;
  maxTilt?: number;
}

export default function TiltedCard({
  imageSrc,
  alt,
  className = "",
  maxTilt = 12,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized values from -0.5 to 0.5
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;
    
    // Set rotation degrees
    setRotateX(-normalizedY * maxTilt);
    setRotateY(normalizedX * maxTilt);

    // Set glare position (0 to 100)
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-card-border bg-card shadow-lg ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? "transform 0.05s ease-out" : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glare Glass Effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.25), transparent 75%)`,
          }}
        />
      )}
      
      {/* Image */}
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover select-none transition-transform duration-500"
        style={{
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      />
    </div>
  );
}

"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  className?: string;
}

export default function ShinyText({ text, className = "" }: ShinyTextProps) {
  return (
    <span className={`inline-block animate-shine ${className}`}>
      {text}
    </span>
  );
}

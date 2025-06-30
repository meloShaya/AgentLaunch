import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glass = false
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-200';
  
  const glassClasses = glass 
    ? 'bg-white/10 backdrop-blur-lg border-white/20' 
    : 'bg-white border-gray-200 shadow-lg';
    
  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' 
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(baseClasses, glassClasses, hoverClasses, className)}
    >
      {children}
    </motion.div>
  );
};
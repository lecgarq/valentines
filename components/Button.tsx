import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-lg shadow-rose-200",
    secondary: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 focus:ring-neutral-200 shadow-sm",
    danger: "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="opacity-70">{icon}</span>}
    </motion.button>
  );
};

import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  className = ''
}) => {
  const baseStyles = "px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]";
  
  const variants = {
    primary: "bg-[#2A2A2A] text-[#F6F3EE] hover:bg-black",
    secondary: "bg-[#F6F3EE] text-[#2A2A2A] border border-[#D9D4CC] hover:bg-[#EFE9E1]",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
    ghost: "bg-transparent text-[#2A2A2A] hover:bg-black/5"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "font-bold py-3 px-6 rounded-2xl transition-all transform active:scale-95 active:translate-y-1 select-none border-b-4";
  
  const variants = {
    primary: "bg-[#58cc02] hover:bg-[#46a302] text-white border-[#46a302] active:border-b-0",
    secondary: "bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-[#1899d6] active:border-b-0",
    danger: "bg-[#ff4b4b] hover:bg-[#d43f3f] text-white border-[#d43f3f] active:border-b-0",
    outline: "bg-transparent border-2 border-gray-200 text-gray-500 hover:bg-gray-50 border-b-2 active:border-b-2",
    ghost: "bg-transparent border-none text-[#1cb0f6] hover:bg-blue-50 uppercase tracking-widest text-sm py-2",
  };

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed active:scale-100 active:translate-y-0" : "";
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
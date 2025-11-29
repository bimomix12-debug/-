import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl bg-white min-h-screen shadow-xl flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};
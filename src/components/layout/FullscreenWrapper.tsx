"use client";

interface FullscreenWrapperProps {
  children: React.ReactNode;
}

const FullscreenWrapper: React.FC<FullscreenWrapperProps> = ({ children }) => {
  return (
    <div className="absolute inset-0 !p-0 !m-0 !max-w-none overflow-hidden">
      {children}
    </div>
  );
};

export default FullscreenWrapper;
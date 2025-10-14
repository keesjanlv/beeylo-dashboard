"use client";
import { useSidebar } from '../../contexts/SidebarContext';
import PositionableSidebar from './PositionableSidebar';
import GlobalBanner from './GlobalBanner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { position } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-50">
      {position === 'left' && <PositionableSidebar position={position} showPositionSwitcher={true} />}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Global banner above navigation within content column */}
        <GlobalBanner />
        {position === 'top' && (
          <div className="sticky top-0 z-20">
            <PositionableSidebar position={position} showPositionSwitcher={true} />
          </div>
        )}
        <main className="flex-1 relative">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-8 ${position === 'top' ? 'pt-0' : 'pt-6'} ${position === 'bottom' ? 'pb-0' : 'pb-6'}`}>
            {children}
          </div>
        </main>
        {position === 'bottom' && (
          <div className="sticky bottom-0 z-20">
            <PositionableSidebar position={position} showPositionSwitcher={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
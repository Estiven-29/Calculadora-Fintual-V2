
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const handleClickOutside = () => {
      setSidebarOpen(false);
    };
    
    // Only add this listener if sidebar is open on mobile
    if (sidebarOpen && isMobile) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [sidebarOpen, isMobile]);

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-financial-midnight'}`}>
      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={(e) => e.stopPropagation()} // Prevent immediate closing
        />
      )}
      
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-30 h-full`}>
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 h-screen overflow-y-auto w-full">
        <div className="flex justify-between items-center p-4">
          {isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-financial-slate text-white'}`}
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-financial-slate text-white'}`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
        
        <main className="flex-1 p-4 md:p-8 w-full">
          {children}
        </main>
      </div>
      
      {isMobile && (
        <button 
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full ${theme === 'light' ? 'bg-blue-500' : 'bg-financial-accent'} text-white shadow-lg`}
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(!sidebarOpen);
          }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
    </div>
  );
};

export default Layout;

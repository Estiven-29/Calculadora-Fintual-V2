
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => Promise<void>;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Load theme preference from database or localStorage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Try to get theme from local storage first
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        
        if (user) {
          // If user is logged in, try to get their theme from the database
          const { data, error } = await supabase
            .from('user_preferences')
            .select('theme')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching theme preference:', error);
            // Fall back to local storage or default
            if (savedTheme) setTheme(savedTheme);
          } else if (data) {
            setTheme(data.theme as Theme);
            // Update local storage to match
            localStorage.setItem('theme', data.theme);
          }
        } else if (savedTheme) {
          // If not logged in but theme is in local storage
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error in theme loading:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [user]);

  // Apply theme class to document
  useEffect(() => {
    // Remove both classes first to avoid conflicts
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    
    // Add the current theme class
    document.documentElement.classList.add(`${theme}-mode`);
    
    // Store in localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    
    // Update state immediately for responsive UI
    setTheme(newTheme);
    
    // Store in localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update in database if user is logged in
    if (user) {
      try {
        // Convert the Date to ISO string for the updated_at field
        const { error } = await supabase
          .from('user_preferences')
          .upsert({ 
            id: user.id, 
            theme: newTheme, 
            updated_at: new Date().toISOString() 
          });
          
        if (error) {
          console.error('Error updating theme preference:', error);
          toast.error('No se pudo guardar tu preferencia de tema');
        }
      } catch (error) {
        console.error('Error in theme update:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const LIGHT_VARS = {
  bg: '#faf9fb', surface: '#ffffff', surface2: '#eef2fb', border: '#e0e6f2',
  text: '#1d1b26', textDim: '#716f80', accent: '#3568e0', accentSoft: '#e4ebfb',
};
const DARK_VARS = {
  bg: '#0f1216', surface: '#171b21', surface2: '#1e2530', border: '#2a323c',
  text: '#f2f2f5', textDim: '#9aa4ac', accent: '#4d84f0', accentSoft: '#1c2942',
};

function getInitialDark() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    const vars = dark ? DARK_VARS : LIGHT_VARS;
    const root = document.documentElement;
    root.style.setProperty('--bg', vars.bg);
    root.style.setProperty('--surface', vars.surface);
    root.style.setProperty('--surface-2', vars.surface2);
    root.style.setProperty('--border', vars.border);
    root.style.setProperty('--text', vars.text);
    root.style.setProperty('--text-dim', vars.textDim);
    root.style.setProperty('--accent', vars.accent);
    root.style.setProperty('--accent-soft', vars.accentSoft);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

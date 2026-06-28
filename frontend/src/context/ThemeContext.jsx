import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

// system (phone/laptop) dark mode lo unda leda chudadam
const getSystemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function ThemeProvider({ children }) {
  // theme: 'light' | 'dark' | 'auto'  (auto = system batti)
  const [theme, setThemeState] = useState(() => localStorage.getItem("theme") || "auto");
  const [language, setLanguageState] = useState(() => localStorage.getItem("language") || "en");

  // resolvedTheme = asalu apply ayye theme (auto resolve chesaka)
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    (localStorage.getItem("theme") || "auto") === "auto" ? getSystemTheme() : (localStorage.getItem("theme") || "light")
  );

  // global CSS variables inject (light/dark colors)
  useEffect(() => {
    if (document.getElementById("sm-theme-vars")) return;
    const s = document.createElement("style");
    s.id = "sm-theme-vars";
    s.innerHTML = `
      :root, [data-theme="light"] {
        --bg:#f5f5f5; --surface:#ffffff; --text:#1a1a1a; --muted:#888;
        --border:#eaeaea; --accent:#e8ff3b; --accent-ink:#1a1a1a;
      }
      [data-theme="dark"] {
        --bg:#0d0d0f; --surface:#18181b; --text:#f4f4f5; --muted:#9a9aa2;
        --border:#2a2a2e; --accent:#e8ff3b; --accent-ink:#1a1a1a;
      }
      body { background: var(--bg); transition: background .3s ease, color .3s ease; }
    `;
    document.head.appendChild(s);
  }, []);

  // theme marinapudu / system marinapudu apply chey
  useEffect(() => {
    const apply = () => {
      const r = theme === "auto" ? getSystemTheme() : theme;
      setResolvedTheme(r);
      document.documentElement.setAttribute("data-theme", r);
    };
    apply();

    // auto mode lo system theme marithe follow avvali
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => { if (theme === "auto") apply(); };
    if (mq.addEventListener) mq.addEventListener("change", listener);
    else mq.addListener(listener);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", listener);
      else mq.removeListener(listener);
    };
  }, [theme]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  }, []);

  const setLanguage = useCallback((l) => {
    setLanguageState(l);
    localStorage.setItem("language", l);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
import React, { useEffect, useState } from "react";

interface ThemeToggleProps {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      setTheme(nextTheme);
      localStorage.setItem("theme-mode", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    };

    // Smooth circular radial View Transition from button center
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyTheme();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (
      document as Document & {
        startViewTransition: (callback: () => void) => {
          ready: Promise<void>;
        };
      }
    ).startViewTransition(() => {
      applyTheme();
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        { clipPath },
        {
          duration: 400,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  if (!mounted) {
    return (
      <div
        className="w-8 h-8 rounded-[4px] border border-[#E8E3DA] dark:border-[#2B2A27] opacity-0"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark/light theme"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="inline-flex items-center justify-center w-8 h-8 rounded-[4px] border border-[#E8E3DA] dark:border-[#2B2A27] bg-[#FAF9F5] dark:bg-[#1E1E1C] hover:bg-[#F3EFE8] dark:hover:bg-[#2B2A27] transition-all cursor-pointer text-[#191817] dark:text-[#FAF9F5] shadow-xs"
    >
      {theme === "dark" ? (
        <i className="bx bx-sun text-[#CC5A2B] text-base" aria-hidden="true" />
      ) : (
        <i className="bx bx-moon text-[#706E6B] text-base" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;

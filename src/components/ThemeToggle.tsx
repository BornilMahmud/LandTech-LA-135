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

    // Smooth circular radial View Transition from button center, matching newDark_portfolio
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
          duration: 750,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  if (!mounted) {
    return (
      <div
        className="w-8 h-8 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] opacity-0"
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
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#E4E4E7] dark:border-[#27272A] bg-white dark:bg-[#121215] hover:bg-[#FAFAFA] dark:hover:bg-[#18181B] transition-all cursor-pointer text-[#09090B] dark:text-[#FAFAFA] shadow-xs"
    >
      {theme === "dark" ? (
        <i className="bx bx-sun text-[#F6BA42] text-base" aria-hidden="true" />
      ) : (
        <i className="bx bx-moon text-[#2563EB] text-base" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;

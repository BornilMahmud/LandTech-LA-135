# 📐 Coding Standards & Guidelines — LandTech-LA-135

**Standard:** Clean Code, Strict Type Safety & High-Performance SVG Rendering  
**Enforcement:** ESLint, TypeScript Compiler (`tsc --noEmit`), Git Hooks  

---

## 1. Core Principles

1. **Explicit Type Contracts:** Every component must declare a strongly-typed `interface Props`. Avoid using `any` or loose index signatures.
2. **Pure Vector Rendering:** Do not dynamically re-calculate SVG `<path d="..." />` coordinates on render cycles. Use CSS `transform` (GPU composite layer) for scale and pan.
3. **Immutability:** Treat GIS datasets (`bangladeshDistrictsGeo.json`, `bangladeshMapData.ts`) as immutable data constants.
4. **Bilingual Completeness:** All user-facing text strings must have both English and Bengali (`bn`) counterparts.

---

## 2. TypeScript & Component Patterns

### 2.1. Functional Component Template
```typescript
import React from 'react';

interface ComponentProps {
  isBn: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  isBn,
  selectedId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`p-4 rounded-xl ${className}`}>
      {/* Component Content */}
    </div>
  );
};
```

### 2.2. Hook Guidelines
- Keep state local whenever possible.
- Use `useMemo` for derived lookups (such as `geoLookup` map index) to avoid $O(n)$ iteration during mouse moves.
- Clean up all interval timers and event listeners inside `useEffect` return functions.

---

## 3. Styling & Tailwind CSS Conventions

### 3.1. Class Name Hierarchy
Follow this order for Tailwind classes:
1. **Layout & Positioning:** `relative`, `absolute`, `flex`, `grid`, `z-10`
2. **Sizing & Spacing:** `w-full`, `max-w-7xl`, `p-4`, `m-2`, `gap-3`
3. **Typography:** `font-heading`, `font-black`, `text-xs`, `text-white`
4. **Visuals & Borders:** `bg-slate-900`, `border`, `border-slate-800`, `rounded-xl`
5. **Interactive & Transitions:** `hover:bg-slate-800`, `transition-all`, `active:scale-95`

### 3.2. Glassmorphism Tokens
Utilize predefined utilities in `src/index.css`:
- `.glass-panel`: Translucent slate backdrop with blur for headers and side drawers.
- `.glass-card`: Subtle gradient card for secondary metrics.

---

## 4. SVG Optimization Rules

1. **`transform-box` and `transform-origin`:**
   ```css
   .district-polygon {
     transform-box: fill-box;
     transform-origin: center;
     transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
   }
   ```
2. **Labels Rendering:**
   Mark overlay labels with `pointer-events-none` and `select-none` so mouse hover and drag events pass cleanly down to the underlying polygon `<path>`.

---

## 5. Git Commit Convention

All commits must adhere to [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(map): add satellite layer toggle in hero section`
- `fix(calc): correct bigha to decimal conversion formula`
- `docs(prd): add due diligence user persona`
- `perf(svg): memoize district geo lookup table`
- `refactor(dossier): extract valuation calculator into tab`

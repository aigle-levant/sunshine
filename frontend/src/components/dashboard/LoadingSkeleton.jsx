// src/components/dashboard/LoadingSkeleton.jsx
//
// Placeholder shapes for the first paint. `variant` picks a silhouette that
// roughly matches what's about to replace it, so the layout doesn't jump.

import useTheme from "../../hooks/useTheme";

function Shimmer({ className = "" }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-full ${
        isLight ? "bg-[#223843]/10" : "bg-white/10"
      } ${className}`}
    />
  );
}

function Card({ children }) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={`rounded-[1.75rem] border p-6 ${
        isLight
          ? "border-[#223843]/10 bg-[#DBD3D8]/45"
          : "border-white/10 bg-white/5"
      }`}
    >
      {children}
    </div>
  );
}

function LoadingSkeleton({ variant = "stats", rows = 3 }) {
  if (variant === "stats") {
    return (
      <div
        role="status"
        aria-label="Loading summary"
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index}>
            <Shimmer className="h-11 w-11" />
            <Shimmer className="mt-6 h-3 w-24" />
            <Shimmer className="mt-3 h-7 w-32" />
            <Shimmer className="mt-3 h-3 w-40" />
          </Card>
        ))}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <Card>
        <div role="status" aria-label="Loading">
          <Shimmer className="h-3 w-28" />
          <Shimmer className="mt-5 h-9 w-2/3" />
          <Shimmer className="mt-4 h-3 w-1/2" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div role="status" aria-label="Loading" className="space-y-4">
        <Shimmer className="h-4 w-40" />

        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-4 pt-1">
            <Shimmer className="h-10 w-10 shrink-0" />

            <div className="min-w-0 flex-1 space-y-2">
              <Shimmer className="h-3 w-1/2" />
              <Shimmer className="h-3 w-1/3" />
            </div>

            <Shimmer className="h-3 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default LoadingSkeleton;

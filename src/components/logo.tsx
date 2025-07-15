import { cn } from "@/lib/utils";
import * as React from "react";

export const ThreatHawkLogo = React.forwardRef<
  SVGSVGElement,
  React.ComponentProps<"svg">
>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-6 w-6", className)}
    {...props}
  >
    <path d="M17.5 19H9.25a2 2 0 0 1-2-2.06v-3.87a2 2 0 0 1 .4-1.2L10 8" />
    <path d="M12 2 4 6v6a8 8 0 0 0 16 0V6Z" />
    <path d="m14 10 3 3" />
  </svg>
));
ThreatHawkLogo.displayName = "ThreatHawkLogo";

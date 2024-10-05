"use client";

import { cn } from "@/lib/utils";
import { ReactElement, ReactNode, cloneElement, useState } from "react";
import {
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UiTooltip,
} from "./ui/tooltip";

export default function Tooltip({
  children,
  content,
  className,
}: {
  children: ReactElement;
  content: ReactNode;
  className?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { disabled } = children.props;

  return (
    <TooltipProvider delayDuration={300}>
      <UiTooltip>
        <TooltipTrigger asChild>
          {disabled ? (
            <div
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {children}
            </div>
          ) : (
            cloneElement(children, {
              onMouseEnter: () => setShowTooltip(true),
              onMouseLeave: () => setShowTooltip(false),
            })
          )}
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent
            className={cn("bg-black text-white border-black", className)}
          >
            <TooltipArrow />
            {content}
          </TooltipContent>
        )}
      </UiTooltip>
    </TooltipProvider>
  );
}

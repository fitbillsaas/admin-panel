"use client";

import { cn } from "@/lib/utils";
import { Rating as RatingComponent, RatingProps } from "primereact/rating";
import { forwardRef } from "react";

const Rating = forwardRef<RatingComponent, RatingProps>(
  ({ className, ...props }, ref) => {
    return <RatingComponent className={cn(className)} ref={ref} {...props} />;
  },
);

Rating.displayName = "Rating";

export { Rating };

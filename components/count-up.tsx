"use client";

import ReactCountUp, { CountUpProps } from "react-countup";

export function CountUp({ options }: { options: CountUpProps }) {
  return <ReactCountUp {...options} />;
}

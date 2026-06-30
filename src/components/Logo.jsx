import Image from "next/image";

const HEIGHTS = {
  sm: "h-8 md:h-9",
  md: "h-10 md:h-12",
  lg: "h-16 md:h-20",
};

export default function Logo({ size = "md", className = "" }) {
  return (
    <Image
      src="/logo/tuktuk-logo-red.png"
      alt="Tuk Tuk Cartagena"
      width={520}
      height={228}
      priority
      className={`w-auto ${HEIGHTS[size] || HEIGHTS.md} ${className}`}
    />
  );
}

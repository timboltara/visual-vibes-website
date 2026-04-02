interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 mb-10 ${alignClass}`}>
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl ${
          light ? "text-white" : "text-vv-black"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-body text-lg max-w-xl ${
            light ? "text-gray-300" : "text-vv-gray-mid"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`h-1 w-16 rounded-full ${align === "center" ? "mx-auto" : ""}`}
        style={{ backgroundColor: "#1A6B6B" }}
      />
    </div>
  );
}

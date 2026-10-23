export default function BrandLogo({
  className = "",
  primaryClassName = "text-gray-900",
  secondaryClassName = "text-emerald-500",
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap font-bold tracking-tight leading-none ${className}`}
      role="img"
      aria-label="Intervyo"
    >
      <span className={primaryClassName}>Interv</span>
      <span className={secondaryClassName}>yo</span>
    </span>
  );
}

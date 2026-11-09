import "./BrandLogo.css";

export default function BrandLogo({ className = "" }) {
  return (
    <span
      className={`brand-logo inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-3 py-1.5 leading-none text-[#171717] shadow-sm ${className}`}
      role="img"
      aria-label="Intervyo"
    >
      Intervyo
    </span>
  );
}

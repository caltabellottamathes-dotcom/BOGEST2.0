/**
 * The Bogèst wordmark — simple white "Bogèst" text set in Cormorant Garamond
 * (semi-bold). Used wherever the brand logo appears across the site.
 */
export default function BogestLogo({ className = '', style }) {
  return (
    <span
      className={`font-logo font-semibold text-white leading-none ${className}`}
      style={style}
    >
      Bogèst
    </span>
  );
}
export default function RouteMap({ query, label, caption }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div className="mb-8">
      <iframe
        src={src}
        title={label}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-40 border border-cream/15"
        style={{ filter: "grayscale(1) invert(92%) contrast(83%)" }}
      />
      {caption && (
        <div className="text-[11px] italic opacity-50 mt-2">{caption}</div>
      )}
    </div>
  );
}

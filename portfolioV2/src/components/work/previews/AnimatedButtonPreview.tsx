export function AnimatedButtonPreview() {
  return (
    <button
      type="button"
      className="pressable btn-bevel relative px-8 py-4 text-sm font-medium"
    >
      <span className="btn-bevel-frame" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-tl" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-tr" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-bl" aria-hidden="true" />
      <span className="btn-bevel-corner btn-bevel-corner-br" aria-hidden="true" />
      Click me
    </button>
  );
}

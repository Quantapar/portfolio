type GridDividerProps = {
  fullWidth?: boolean;
  double?: boolean;
};

export function GridDivider({
  fullWidth = false,
  double = false,
}: GridDividerProps) {
  if (fullWidth && double) {
    return <div className="full-bleed-double-divider w-full" aria-hidden="true" />;
  }

  if (fullWidth) {
    return <div className="full-bleed-divider w-full" aria-hidden="true" />;
  }

  return <div className="grid-divider-x" aria-hidden="true" />;
}

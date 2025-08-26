export const CloseIcon = ({
  width,
  height,
}: {
  width: string;
  height: string;
}) => (
  <svg viewBox="0 0 12 12" width={width} height={height}>
    <line x1="1" y1="11" x2="11" y2="1" stroke-width="2" />
    <line x1="1" y1="1" x2="11" y2="11" stroke-width="2" />
  </svg>
);

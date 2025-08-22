export const StarIcon = ({
  width,
  height,
  stroke,
  fill,
}: {
  width: string;
  height: string;
  stroke: string;
  fill: string;
}) => (
  <svg viewBox="0 0 24 24" width={width} height={height}>
    <path
      d="M12 2l3 7h7l-5 5 2 7-6-4-6 4 2-7-5-5h7z"
      stroke={stroke}
      fill={fill}
    ></path>
  </svg>
);

import type { ReactNode } from "react";
import { classes } from "../../../../common_utils/classes/classes";
import styles from "./skeleton.module.scss";

export const Skeleton = ({
  lines = 3,
  children,
}: {
  lines?: number;
  children?: ReactNode;
}) => {
  if (children) {
    return <div className={styles.skeleton}>{children}</div>;
  }
  return (
    <div className={styles.skeleton}>
      {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
        <div
          key={i}
          className={classes(
            styles.skeletonLine,
            i === 0 ? "short" : i === lines - 1 ? "medium" : "full"
          )}
        />
      ))}
    </div>
  );
};

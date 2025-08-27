import type { ReactNode } from "react";
import { labelSize } from "./constants/constants";
import { Dots } from "./components/Dots/Dots";
import { Skeleton } from "./components/Skeleton/Skeleton";
import { Spinner } from "./components/Spinner/Spinner";
import { Bar } from "./components/Bar/Bar";
import { classes } from "../../common_utils/classes/classes";

import styles from "./loading.module.scss";

export const Loading = ({
  variant = "spinner",
  size = "md",
  label,
  fullScreen,
  overlay,
  skeletonLines = 3,
  children,
  dark,
}: {
  variant?: "spinner" | "dots" | "skeleton" | "bar";
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  skeletonLines?: number;
  children?: ReactNode;
  dark?: boolean;
}) => {
  const body = (
    <div
      className={classes(styles.loading, styles.loadingLabel, {
        [styles.dark]: dark,
        [styles.fullscreen]: fullScreen,
        [styles.overlay]: overlay,
      })}
      role="status"
      aria-live="polite"
    >
      {variant === "spinner" && <Spinner size={size} />}
      {variant === "dots" && <Dots />}
      {variant === "bar" && <Bar />}
      {variant === "skeleton" && (
        <Skeleton lines={skeletonLines}>{children}</Skeleton>
      )}
      {label && <span className={classes(labelSize[size])}>{label}</span>}
      {/* <span
        className={classes({
          [styles.srOnly]: srOnly,
        })}
      >
        {label ?? "Loading"}
      </span> */}
    </div>
  );

  if (fullScreen || overlay) {
    return (
      <div
        className={classes({
          [styles.fullscreen]: fullScreen,
          [styles.overlay]: overlay,
        })}
      >
        {body}
      </div>
    );
  }

  return body;
};

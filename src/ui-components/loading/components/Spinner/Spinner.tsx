import { classes } from "../../../../common_utils/classes/classes";
import { loadingSize } from "../../constants/constants";
import styles from "./styles.module.scss";

export const Spinner = ({
  size = "md",
  color = "black",
}: {
  size?: "sm" | "md" | "lg" | "xs";
  color?: "black" | "white" | "warning";
}) => {
  return (
    <div
      className={classes(styles.spinner, styles[color], {
        [styles[loadingSize[size]]]: !!size,
      })}
      aria-hidden
    />
  );
};

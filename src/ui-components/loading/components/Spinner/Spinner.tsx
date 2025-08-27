import { classes } from "../../../../common_utils/classes/classes";
import { loadingSize } from "../../constants/constants";
import styles from "./styles.module.scss";

export const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  console.log("SIZE: ", size);
  return (
    <div
      className={classes(styles.spinner, {
        [styles[loadingSize[size]]]: !!size,
      })}
      aria-hidden
    />
  );
};

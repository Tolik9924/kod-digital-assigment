import { CloseIcon } from "../../assets/CloseIcon";
import { classes } from "../../common_utils/classes/classes";
import { Variant, type VariantType } from "../../shared/parameters/parameters";

import styles from "./tag.module.scss";

export const Tag = ({
  label,
  variant = "primary",
  onRemove,
}: {
  label: string;
  variant?: VariantType;
  onRemove?: (label: string) => void;
}) => {
  return (
    <div
      className={classes(styles.nameTag, {
        [styles[Variant[variant]]]: !!variant,
      })}
    >
      <span>{label}</span>
      {onRemove && (
        <span className={styles.closeIcon} onClick={() => onRemove(label)}>
          <CloseIcon width="6" height="11" />
        </span>
      )}
    </div>
  );
};

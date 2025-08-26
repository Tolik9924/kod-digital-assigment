import { capitalizeFirstLetter } from "../../common_utils/capitalize/capitalize";
import { classes } from "../../common_utils/classes/classes";
import {
  margin,
  type MarginProps,
} from "../../common_utils/design_atoms/margin/margin";
import {
  Size,
  Variant,
  type SizeType,
  type VariantType,
} from "../../shared/parameters/parameters";

import styles from "./input.module.scss";

export type Props = {
  value: string | number;
  handleChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  id?: string;
  label?: string;
  isDisabled?: boolean;
  size?: SizeType;
  fullWidth?: boolean;
  variant?: VariantType;
  error?: string;
  elementType?: "input";
};

export const Input = ({
  elementType: ElementType = "input",
  label = "string",
  id = label || "id",
  isDisabled = false,
  size = "m",
  fullWidth = false,
  variant = "primary",
  error,
  handleChange,
  value,
  type = "text",
  ...rest
}: Props & MarginProps) => {
  return (
    <div
      className={classes(styles.inputContainer, margin(rest), {
        [styles.fullWidth]: fullWidth,
      })}
    >
      <ElementType
        className={classes(styles.input, {
          [styles[Variant[variant]]]: variant,
          [styles.disabled]: isDisabled,
          [styles.placeholder]: label,
          [styles[Size[size]]]: !!size,
          [styles.errored]: error,
        })}
        placeholder={capitalizeFirstLetter(label)}
        autoComplete="off"
        disabled={isDisabled}
        id={id}
        type={type}
        onChange={handleChange}
        value={value}
        min={0}
        {...rest}
      />
      {error && (
        <span
          className={classes({
            [styles[`error_${Size[size]}`]]: !!size,
            [styles.errorSpan]: error,
          })}
        >
          {error}
        </span>
      )}
    </div>
  );
};

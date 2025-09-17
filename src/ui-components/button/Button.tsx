import { type MouseEvent, type ReactNode, forwardRef } from "react";
import { classes } from "../../common_utils/classes/classes";
import {
  Size,
  Variant,
  type SizeType,
  type VariantType,
} from "../../shared/parameters/parameters";
import {
  margin,
  type MarginProps,
} from "../../common_utils/design_atoms/margin/margin";

import styles from "./button.module.scss";

type Ref = HTMLButtonElement;
type Props = {
  children: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  size?: SizeType;
  variant?: VariantType;
  fullWidth?: boolean;
  elementType?: "button" | "a";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
} & MarginProps;

export const Button = forwardRef<Ref, Props>(function Button(props, ref) {
  const {
    elementType: ElementType = "button",
    type,
    children,
    size = "m",
    variant = "primary",
    fullWidth = true,
    disabled = false,
    onClick,
    ...rest
  } = props;

  return (
    <ElementType
      className={classes(styles.button, margin(rest), {
        [styles[Size[size]]]: !!size,
        [styles[Variant[variant]]]: !!variant,
        [styles.fullWidth]: fullWidth,
      })}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      // @ts-expect-error - ref should refer to the same type of element as ElementType
      ref={ref}
    >
      {children}
    </ElementType>
  );
});

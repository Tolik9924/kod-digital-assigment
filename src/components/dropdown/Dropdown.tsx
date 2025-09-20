import { useEffect, useRef, useState } from "react";
import {
  margin,
  type MarginProps,
} from "../../common_utils/design_atoms/margin/margin";
import { classes } from "../../common_utils/classes/classes";
import { type SizeType } from "../../shared/parameters/parameters";

import styles from "./dropdown.module.scss";
import { AngelDown } from "../../assets/AngelDown";
import { Tag } from "../../ui-components/tag/Tag";

export type DropdownItem = {
  id: string;
  name: string;
};

export type DropdownProps = {
  id: string;
  options: DropdownItem[];
  onSelect: (id: string | string[]) => void;
  title?: string;
  fullWidth?: boolean;
  selectedId?: string;
  selectedIds?: string[];
  size?: SizeType;
  isMultiple?: boolean;
};

export const Dropdown = ({
  id,
  options,
  title = "Select",
  selectedId,
  selectedIds = [],
  fullWidth,
  size = "m",
  onSelect,
  isMultiple = false,
  ...rest
}: DropdownProps & MarginProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const titleSize = `${size}Title`;

  const handleChange = (item: DropdownItem) => {
    const sameItem =
      isMultiple && !selectedIds?.find((selected) => selected === item.name);
    if (isMultiple && sameItem) {
      onSelect([item.name, ...selectedIds]);
    }

    if (!isMultiple) {
      onSelect(item.name);
    }
  };

  const deleteItem = (id: string) => {
    if (isMultiple) {
      const newSelection = selectedIds.filter((sid) => sid !== id) ?? [];
      onSelect(newSelection);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, isOpen]);

  return (
    <div
      className={classes(styles.dropdownContainer, margin(rest), {
        [styles.fullWidth]: fullWidth,
      })}
      ref={dropdownRef}
    >
      <button
        className={classes(styles.button, {
          [styles.emptyContainer]: selectedIds.length === 0,
        })}
        onClick={() => setIsOpen(!isOpen)}
        id={id}
        type="button"
      >
        <div
          className={styles.infoContainer}
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isMultiple && (
            <span
              className={classes(styles.name, {
                [styles[titleSize]]: !!size,
              })}
            >
              {selectedIds || title}
            </span>
          )}
          {isMultiple && (
            <div className={styles.multipleTags}>
              {selectedIds.map((item) => (
                <Tag
                  key={item}
                  label={item}
                  onRemove={deleteItem}
                  variant="primary"
                />
              ))}
            </div>
          )}
          <div className={styles.arrowDownContainer}>
            <AngelDown />
          </div>
        </div>
      </button>
      {isOpen && (
        <div className={styles.menuContainer}>
          <ul className={styles.menu} role="menu">
            {options.map((item) => (
              <li
                className={styles.menuItem}
                key={item.id}
                onClick={() => {
                  handleChange(item);
                }}
              >
                <span
                  className={classes(styles.itemLink, {
                    [styles.selectedLink]: isMultiple
                      ? selectedIds?.some((selected) => selected === item.name)
                      : selectedId === item.name,
                  })}
                >
                  <h5 className={styles.nameHeader}>{item.name}</h5>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

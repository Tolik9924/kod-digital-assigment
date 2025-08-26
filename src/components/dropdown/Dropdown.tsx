import { useEffect, useRef, useState } from "react";
import {
  margin,
  type MarginProps,
} from "../../common_utils/design_atoms/margin/margin";
import { classes } from "../../common_utils/classes/classes";
import { Size, type SizeType } from "../../shared/parameters/parameters";

import styles from "./dropdown.module.scss";
import { CloseIcon } from "../../assets/CloseIcon";
import { AngelDown } from "../../assets/AngelDown";

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
  selectedIds,
  fullWidth,
  size = "m",
  onSelect,
  isMultiple = false,
  ...rest
}: DropdownProps & MarginProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const titleSize = `${size}Title`;

  const [selectedItems, setSelectedItems] = useState<DropdownItem[]>(
    isMultiple && selectedIds?.length
      ? options?.filter((item) => selectedIds.includes(item.name)) || []
      : selectedId
      ? options?.filter((item) => item.id === selectedId) || []
      : []
  );

  const handleChange = (item: DropdownItem) => {
    const sameItem = !selectedItems.find((selected) => selected.id === item.id);
    if (isMultiple && sameItem) {
      setSelectedItems((prev) => [item, ...prev]);
      onSelect([item.name, ...selectedItems.map((item) => item.name)]);
    }

    if (!isMultiple) {
      setSelectedItems([item]);
      onSelect(item.id);
    }

    setIsOpen(false);
  };

  const deleteItem = (item: DropdownItem) => {
    const filtered = selectedItems.filter((select) => select.id !== item.id);
    setSelectedItems(filtered);
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
          [styles[Size[size]]]: !!size,
        })}
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.infoContainer}>
          {!isMultiple && (
            <span
              className={classes(styles.name, {
                [styles[titleSize]]: !!size,
              })}
            >
              {selectedItems[0]?.name || title}
            </span>
          )}
          {isMultiple && (
            <div
              className={styles.multipleTags}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItems.map((item) => (
                <div key={item.id} className={classes(styles.nameTag)}>
                  <span>{item.name}</span>
                  <span
                    className={styles.closeIcon}
                    onClick={() => deleteItem(item)}
                  >
                    <CloseIcon width="6" height="11" />
                  </span>
                </div>
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
                    [styles.selectedLink]: selectedItems.some(
                      (selected) => selected.id === item.id
                    ),
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

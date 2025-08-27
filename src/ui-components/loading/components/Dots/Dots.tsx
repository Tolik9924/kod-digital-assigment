import styles from "./dots.module.scss";

export const Dots = () => {
  return (
    <div className={styles.dots} aria-hidden>
      <div className={styles.loaderDots} aria-hidden>
        <span className={styles.label}></span>
        <span className={styles.label}></span>
        <span className={styles.label}></span>
      </div>
    </div>
  );
};

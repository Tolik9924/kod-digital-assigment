import styles from "./bar.module.scss";

export const Bar = () => {
  return (
    <div className={styles.loaderBar} aria-hidden>
      <div className={styles.barFill} />
    </div>
  );
};

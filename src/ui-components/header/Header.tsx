import styles from "./header.module.scss";

export const Header = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.items}>{content}</div>
      </div>
    </div>
  );
};

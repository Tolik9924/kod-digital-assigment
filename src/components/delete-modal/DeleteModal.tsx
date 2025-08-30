import { Button } from "../../ui-components/button/Button";
import styles from "./deleteModal.module.scss";

export const DeleteModal = ({ handleDelete }: { handleDelete: () => void }) => {
  return (
    <div className={styles.delete}>
      <h3>Delete Modal</h3>
      <div className={styles.buttonsContainer}>
        <Button onClick={handleDelete} size="s" variant="error">
          Delete
        </Button>
        <Button size="s">Cancel</Button>
      </div>
    </div>
  );
};

import { useState, type ChangeEvent } from "react";
import { fetchMovies } from "../../features/movies/moviesThunks";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { Input } from "../../ui-components/input/Input";
import { Button } from "../../ui-components/button/Button";
import { ACTION, type Action } from "./constants";
import styles from "./usernameModal.module.scss";

export const UsernameModal = ({
  cardTitle,
  action,
  sendData,
}: {
  cardTitle: string;
  action: Action;
  sendData: () => void;
}) => {
  const [username, setUsername] = useState("");
  const { searchTitle } = useSelector((state: RootState) => state.movies);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUsername(value);
  };

  const sendUsername = async () => {
    const oldUsername = await localStorage.getItem("username");
    setUsername("");
    await localStorage.setItem("username", username);
    await sendData();
    if (oldUsername && oldUsername !== username) {
      await dispatch(fetchMovies(searchTitle));
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.cardTitle}>
        {action}: {cardTitle}?
      </h3>
      <div className={styles.enterUsername}>
        <span className={styles.enterUsernameTitle}>Enter Username</span>
        <Input
          label="username"
          value={username}
          handleChange={handleChange}
          size="m"
          fullWidth
        />
      </div>
      <div className={styles.sendContainer}>
        <Button
          onClick={sendUsername}
          fullWidth
          size="s"
          variant={
            (username.trim().length === 0 && "on-dark") ||
            (action === ACTION.delete ? "error" : "primary")
          }
          disabled={username.trim().length === 0}
        >
          {action.toLocaleUpperCase()}
        </Button>
      </div>
    </div>
  );
};

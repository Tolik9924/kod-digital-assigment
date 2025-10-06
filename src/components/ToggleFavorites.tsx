import { useState } from "react";
import { Button } from "../ui-components/button/Button";
import { Modal } from "./modal/Modal";
import { UsernameModal } from "./username-modal/UsernameModal";
import { ACTION } from "./username-modal/constants";

interface Props {
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
}

export const ToggleFavorites: React.FC<Props> = ({
  showFavorites,
  setShowFavorites,
}) => {
  const [showUsername, setShowUsername] = useState(false);
  const handleShowFavorites = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setShowUsername(true);
    } else {
      setShowFavorites(!showFavorites);
    }
  };

  const sendData = () => {
    setShowFavorites(!showFavorites);
    setShowUsername(false);
  };

  return (
    <>
      <Button
        onClick={() => handleShowFavorites()}
        size="m"
        variant="secondary"
      >
        {showFavorites ? "Show All" : "Favorites"}
      </Button>
      <Modal isOpen={showUsername} onClose={() => setShowUsername(false)}>
        <UsernameModal
          cardTitle="All Favorites"
          action={ACTION.show}
          sendData={sendData}
        />
      </Modal>
    </>
  );
};

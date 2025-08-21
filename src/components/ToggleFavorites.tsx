import { Button } from "../ui-components/button/Button";

interface Props {
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
}

export const ToggleFavorites: React.FC<Props> = ({
  showFavorites,
  setShowFavorites,
}) => (
  <Button
    onClick={() => setShowFavorites(!showFavorites)}
    size="s"
    variant="secondary"
  >
    {showFavorites ? "Show All" : "Favorites"}
  </Button>
);

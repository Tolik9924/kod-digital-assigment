interface Props {
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
}

export const ToggleFavorites: React.FC<Props> = ({
  showFavorites,
  setShowFavorites,
}) => (
  <button onClick={() => setShowFavorites(!showFavorites)}>
    {showFavorites ? "Show All" : "★ Favorites"}
  </button>
);

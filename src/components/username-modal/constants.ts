export const ACTION = {
  delete: "Delete",
  toggleFavorite: "Toggle favorite",
  show: "Show",
} as const;

export type Action = (typeof ACTION)[keyof typeof ACTION];

import React from "react";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export const SearchBar: React.FC<Props> = ({ searchQuery, setSearchQuery }) => (
  <input
    type="text"
    placeholder="Search movies..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
);

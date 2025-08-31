import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/Home";
import { MovieDetails } from "./pages/movie-details/MovieDetails";

export const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:title" element={<MovieDetails />} />
    </Routes>
  </Router>
);

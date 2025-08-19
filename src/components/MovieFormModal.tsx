import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import type { Movie } from "../features/movies/types";

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  z-index: 10;
`;

interface Props {
  movie?: Movie;
  onSave: (movie: Movie) => void;
  onCancel: () => void;
  existingTitles: string[];
}

const MovieFormModal: React.FC<Props> = ({
  movie,
  onSave,
  onCancel,
  existingTitles,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Movie>({
    defaultValues: movie || {
      Title: "",
      Year: "",
      Runtime: "",
      Genre: "",
      Director: "",
    },
  });

  const submit = (data: Movie) => {
    if (!movie && existingTitles.includes(data.Title.toLowerCase())) {
      alert("A movie with the same name already exists.");
      return;
    }
    onSave(data);
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit(submit)}>
        {["Title", "Year", "Runtime", "Genre", "Director"].map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input
              {...register(field as keyof Movie, {
                required: true,
                minLength: 3,
              })}
            />
            {errors[field as keyof Movie] && (
              <p>{field} must be at least 3 characters.</p>
            )}
          </div>
        ))}
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default MovieFormModal;

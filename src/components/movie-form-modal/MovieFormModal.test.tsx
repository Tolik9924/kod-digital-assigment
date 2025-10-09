import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
//import configureStore from "redux-mock-store";
import { configureStore } from "@reduxjs/toolkit";
import MovieFormModal from "./MovieFormModal";
import moviesReducer from "../../features/movies/moviesSlice";

jest.mock("../../services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("../../hooks/useMovie", () => ({
  __esModule: true,
  useMovie: jest.fn(() => ({
    Username: "TestUser",
    Title: "",
    Runtime: "",
    Year: "",
    Genre: "",
    Director: "",
    isFavorite: false,
    Type: "movie",
  })),
}));

// Mock для dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => "TestUser");
  Storage.prototype.setItem = jest.fn();
});

const preloadedState = {
  movies: {
    searchTitle: "",
    movie: {
      imdbID: "",
      Poster: "",
      Title: "",
      Year: "",
      Runtime: "",
      Genre: "",
      Director: "",
      Type: "",
      isFavorite: false,
    },
    movies: [],
    loadings: {
      loadingMovies: false,
      loadingMovie: false,
      loading: false,
      loadingAdding: false,
    },
    deleteMovie: "",
  },
};

// Створюємо фейковий store
const store = configureStore({
  reducer: { movies: moviesReducer },
  preloadedState,
});

describe("MovieFormModal", () => {
  test("Render all fields of form", () => {
    render(
      <Provider store={store}>
        <MovieFormModal onSave={jest.fn()} onCancel={jest.fn()} />
      </Provider>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Runtime/i)).toBeInTheDocument();
    const renderedGenres = screen
      .getAllByTestId("genre-item")
      .map((el) => el.textContent);
    expect(renderedGenres).toEqual(expect.arrayContaining([]));
    //expect(screen.getByText(/Genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Director/i)).toBeInTheDocument();
  });

  test("showing mistakes during submit empty field", async () => {
    render(
      <Provider store={store}>
        <MovieFormModal onSave={jest.fn()} onCancel={jest.fn()} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Year\(s\) is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Genre is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Director name can only contain letters and spaces, each part starting with uppercase./i
        )
      ).toBeInTheDocument();
    });
  });

  test("submit with valid data call onSave", async () => {
    const mockOnSave = jest.fn().mockResolvedValue({
      imdbID: "tt1234567",
    });

    render(
      <Provider store={store}>
        <MovieFormModal onSave={mockOnSave} onCancel={jest.fn()} />
      </Provider>
    );

    // Заповнення полів
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "TestUser" },
    });
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Star Wars" },
    });
    fireEvent.change(screen.getByLabelText(/Year/i), {
      target: { value: "1999" },
    });
    fireEvent.change(screen.getByLabelText(/Runtime/i), {
      target: { value: "120" },
    });
    fireEvent.change(screen.getByLabelText(/Director/i), {
      target: { value: "George Lucas" },
    });

    // Для жанрів — імітуємо вибір через dropdown
    // Тут достатньо викликати onSelect напряму через клік
    fireEvent.click(screen.getByText(/Genre/i)); // відкриває dropdown
    // припустимо, жанри мокані в GENRES, тому можна клікнути перший варіант
    const firstGenre = screen.getByText(/Action/i);
    fireEvent.click(firstGenre);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const [arg] = mockOnSave.mock.calls[0];
      expect(arg.username).toBe("TestUser");
      expect(arg.movie.Title).toBe("Star Wars");
      expect(arg.movie.Year).toBe("1999");
      expect(arg.movie.Genre).toBe("Action");
      expect(arg.movie.Runtime).toBe("120 min");
      expect(arg.movie.Director).toBe("George Lucas");
    });
  });

  test("calls onCancel during calling button Cancel", () => {
    const onCancel = jest.fn();
    render(
      <Provider store={store}>
        <MovieFormModal onSave={jest.fn()} onCancel={onCancel} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});

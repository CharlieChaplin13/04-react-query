import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import {fetchMovies} from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const openModal = (movie: Movie) => {
      setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);

  const handleSearch = async (query: string) => {
    try{
      setIsLoading(true);
      setIsError(false);
      setMovies([]);
      const data = await fetchMovies(query);
      if (data.length === 0) {
        toast.error("No movies found for your request."); 
        return;
      } 
      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={css.app}>
      <Toaster position="top-right"/>
      <SearchBar onSubmit={handleSearch}/>
      {isLoading && <Loader />}
      {isError && <ErrorMessage/>}
      {movies.length > 0 && !isLoading && (
       <MovieGrid movies={movies} onSelect={openModal}/>
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal}/>}
    </div>
  );
}
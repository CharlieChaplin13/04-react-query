import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

import Loader from "../Loader/Loader";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Paginate from "../Paginate/Paginate";
import {fetchMovies} from "../../services/movieService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = (movie: Movie) => {
      setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movie', query, currentPage],
        queryFn: () => fetchMovies(query, currentPage),
        enabled: query !== "",
        placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;
  const moviesList = data?.results ?? [];

  useEffect(() => {
    if (isSuccess && query !== "" && moviesList.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, moviesList.length, query]);

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  }

  return (
    <div className={css.app}>
      <Toaster position="top-right"/>
      <SearchBar onSubmit={handleSearch}/>
      {isSuccess && totalPages > 1 && (
        <Paginate
          totalPages={totalPages}
          page={currentPage}
          setPage={setCurrentPage}
        />  
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage/>}

      {moviesList.length > 0 && !isLoading && (
       <MovieGrid movies={moviesList} onSelect={openModal}/>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal}/>}
    </div>
  );
}
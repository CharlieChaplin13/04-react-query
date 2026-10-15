import axios from "axios";
import type { Movie } from "../types/movie"; 

interface MoviesHttpResponse {
  results: Movie[];
}

const token = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (query: string):
Promise<Movie[]> => {
  const url = `https://api.themoviedb.org/3/search/movie`;

  const options = {
    params: {
      query: query,
      include_adult: false
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
  };

    const response = await axios.get<MoviesHttpResponse> (url, options) 

    const allMovies = response.data.results;

const cleanMovies =  allMovies.filter((movie) => {

  if (movie.adult) return false;
  if (!movie.release_date || movie.release_date === "") return false;
  if (!movie.overview || movie.overview.trim() === "") return false;
  if (movie.vote_average === 0 && !movie.backdrop_path) return false;
  if (movie.popularity < 1.5) return false;
  if (movie.vote_count === 0) return false;

  const title = movie.title.toLowerCase();
  const overview = movie.overview.toLowerCase();
  
  const stopWords = ["xxx", "porn", "erotic", "desire", "sexy", "sex", "hentai", "nudity"];
  const hasStopWord = stopWords.some(word => 
    title.includes(word) || overview.includes(word)
  );

  return !hasStopWord;
});
return cleanMovies.sort((a, b) => b.popularity - a.popularity);
  
}

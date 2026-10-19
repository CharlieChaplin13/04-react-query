import axios from "axios";
import type { Movie } from "../types/movie"; 

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

const token = import.meta.env.VITE_TMDB_TOKEN;
const url = `https://api.themoviedb.org/3/search/movie`;

export const fetchMovies = async (
  query: string,
  page: number,
): Promise<MoviesHttpResponse> => {
  const options = {
    params: {
      query, 
      page,
      include_adult: false
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  
  const response = await axios.get<MoviesHttpResponse>(url, options);
  return response.data;
};


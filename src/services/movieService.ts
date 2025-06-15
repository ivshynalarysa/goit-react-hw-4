import axios from "axios";
import { type Movie } from "../types/movie";


const myKey = import.meta.env.VITE_TMDB_TOKEN;

interface MovieResults {
    results: Movie[];
    total_pages: number;
}

export async function fetchMovies(data: string, page: number): Promise<MovieResults> {
   
    const result = await axios.get<MovieResults>(`https://api.themoviedb.org/3/search/movie?query=${data}`, {
        headers: { Authorization: `Bearer ${myKey}` },
        params: {
            query: data,
            page,
        }
        
       
    });
    return result.data;
}
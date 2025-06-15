import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import  {toast, Toaster} from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useEffect,  useState } from 'react';
import type { Movie } from '../../types/movie'
import {keepPreviousData, useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate';





export default function App() {
  const [movie, setMovie] = useState('');
  //const [count, setCount] = useState(1);
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending, isError, isSuccess} = useQuery ({
    queryKey: ['movie', movie, currentPage],
    queryFn: () => fetchMovies(movie, currentPage),
    enabled: movie !== '',
    placeholderData: keepPreviousData,
  });
  

  const totalPages: number  = data?.total_pages?? 1;

    useEffect(() => {
        if (data?.results.length === 0) {
            toast.error("No movies found for your request.");
        }
    }, [data]);

function handleSubmit(newMovie: string) {
      setMovie(newMovie);
      setCurrentPage(1);
    //try {
     // setMovies([])
     // setIsLoading(true);
     // setIsError(false);
     // const newMovies = await fetchMovies(data);
     // setMovies(newMovies);
      //if (newMovies.length === 0) {
      //  toast.error("No movies found for your request.");
     // }
      
   // } catch {
    //    toast.error("Failed to fetch movies. Please try again.");
    //   setIsError(true);
    //} finally {
    //    setIsLoading(false);
   // }
  };
  
function selectMovie(movie: Movie): void {
    setSelectedMovie(movie);
}

function handleCloseModal(): void {
  setSelectedMovie(null);
}
  

  return ( 
    
    
      <div className={css.app}>

        <SearchBar onSubmit={handleSubmit}/>
    
        <Toaster 
            toastOptions={{
            error: {
            style: {
            color: 'white',
            background: 'red',
      },
    },
  }}
        />
        {isSuccess && totalPages > 1 && 
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />}
        {isPending && movie !== "" && <Loader/>}
        {isError && <ErrorMessage/>}
        {data && data.results.length > 0 && <MovieGrid onSelect={selectMovie} movies={data.results} />}
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      
      </div>

      

    )
  
}
import axios, { isCancel, AxiosError } from 'axios';
import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import Genre from './entities/genre.js';

async function FetchMovies() {
    let movie_list = [];
    for (let page = 1; page < 21; page++) {
    await axios
        .get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, {
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
            }
        })
        .then((response) => {
            movie_list = movie_list.concat(response.data.results);
            //console.log(response.data.results)
            //console.log(response.data.results.length);
            console.log(movie_list.length)
            //console.log(movie_list)
        })
        .catch((error) => {
            // Do something if call failed
            console.log(error)
        });
        
    }
    
    return { movie_list }
}

async function FetchGenre() {
    let genre_list = [];

    await axios
        .get('https://api.themoviedb.org/3/genre/movie/list', {
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
            }
        })
        .then((response) => {
            //console.log(response)
            genre_list = response.data.genres;
            //console.log(genre_list)
        })
        .catch((error) => {
            // Do something if call failed
            console.log(error)
        });
    return { genre_list }
}
async function registerFetchMoviesGenres(fetched_movie_list, fetched_genre) {
    //console.log(fetched_movie_list)
    //let movie_list = [];
    await appDataSource.initialize();
    //console.log(fetched_genre);
    const movieRepository = appDataSource.getRepository(Movie);
    const genreRepository = appDataSource.getRepository(Genre);
    let dico_genre = {}
    for (let genre of fetched_genre.genre_list) {
        //console.log(genre)
        const newGenre = genreRepository.create({
            name: genre.name,
            id: genre.id,
        });
        //console.log(newGenre);
        let id_st = genre.id.toString();
        
        genreRepository.save(newGenre);
        //dico_genre[id_st] =
    }
    //console.log(dico_genre)
    for (let movie of fetched_movie_list.movie_list)
    {
        let liste_genre = [];
            for (let id of movie.genre_ids) {
                //let id_st = id.toString()
                let add_genre = await genreRepository.findOne({where: {id: id}})
                liste_genre.push(add_genre)
            }
        //console.log(liste_genre)
        const newMovie = movieRepository.create({ 
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            description: movie.overview,
            popularity: movie.popularity,
            genres: liste_genre
        });
        movieRepository.save(newMovie);
        //console.log(newMovie);
    }
}
const fetched_genre = await FetchGenre()
const fetched_movies = await FetchMovies()
//console.log(fetched_movies)
registerFetchMoviesGenres(fetched_movies, fetched_genre)
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Thriller'];

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results) {
          console.error("Invalid API key or TMDB limit exceeded:", data);
          return;
        }

        const formatted = data.results.map((m) => ({
          title: m.title,
          year: m.release_date?.slice(0, 4),
          poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          genre: 'All', // You can improve genre later
        }));

        setMovies(formatted);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGenre === 'All' || movie.genre === selectedGenre)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🎬 Movie Recommendations</h1>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-72"
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2 rounded-lg text-black w-40"
        >
          {genres.map((genre, i) => (
            <option key={i} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-gray-400">{movie.year}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 mt-10">
            No movies found. 🕵️‍♂️
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

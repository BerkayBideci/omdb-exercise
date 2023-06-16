"use client"
import { useEffect, useState } from 'react'

export default function Home() {

  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [nominate, setNominate] = useState([])
  const [winner, setWinner] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      if (search.trim() !== "" && search.length > 2) {
        const response = await fetch(`http://www.omdbapi.com/?apikey=f771777c&s=${search}`)
        const data = await response.json()

        if (data && data.Search) {
          const manipulatedData = [...data.Search]
          setData(manipulatedData.slice(0, 10))
          setError(null)
          setIsLoading(false)
        }

      } if (search.trim() !== "" && search.length >= 1 && search.length <= 2) {
        setError("Too many results. Please adjust your search.")
        setIsLoading(false)

      } if (search.length === 0) {
        setError(null)
        setIsLoading(false)

      } else if (search.trim() !== "" && data.length === 0 && search.length > 2) {
        setError("No movies found.")
        setIsLoading(false)

      } else {
        setData([])
        setIsLoading(false)
      }

    }
    fetchData()
  }, [search])

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const handleNominate = (movie) => {
    const isNominated = nominate.some((nominatedMovie) => nominatedMovie.imdbID === movie.imdbID)
    if (!isNominated && nominate.length < 5) {
      setNominate([...nominate, movie])
      setError(null)
    } else if (nominate.length === 5) {
      setError("Nominated list can't include more than 5 movies!")
    }
  }

  const handleDismiss = (movie) => {
    const updatedNominations = nominate.filter((nominatedMovie) => nominatedMovie.imdbID !== movie.imdbID);
    setNominate(updatedNominations);
    if (nominate.length <= 5) {
      setError(null)
    }
  };

  const handleReveal = () => {
    const winnerNumber = Math.floor(Math.random(nominate) * nominate.length);
    setWinner(nominate[winnerNumber])
  }

  const handleRestart = () => {
    location.reload()
  }

  const movies = data.map((movie) => {
    const className = nominate.includes(movie) ? "hidden" : "bg-slate-300";
    return (
      <div className='flex flex-col justify-stretch items-center' key={movie.imdbID}>
        <img src={movie.Poster === "N/A" ? "/movieLogo.png" : movie.Poster} alt={movie.Title + `'s Poster`} className='w-60 h-72'></img>
        <h3>{movie.Title ? movie.Title : "No Title Found"}</h3>
        <p>Year: {movie.Year}</p>
        <button className={className} onClick={() => handleNominate(movie)}>Nominate</button>
      </div>
    )
  })

  const nominatedMovies = nominate.map((movie) => {
    return (
      <div className='flex flex-col justify-stretch items-center' key={movie.imdbID}>
        <img src={movie.Poster === "N/A" ? "/movieLogo.png" : movie.Poster} alt={movie.Title + `'s Poster`} className='w-60 h-72'></img>
        <h3>{movie.Title ? movie.Title : "No Title Found"}</h3>
        <p>Year: {movie.Year}</p>
        <strong>Nominated</strong>
        <button className={winner ? "hidden" : "bg-slate-300"} onClick={() => handleDismiss(movie)}>Dismiss</button>
      </div>
    )
  })

  return (
    <>
      <div className='container w-10/12 mx-auto flex flex-col items-center justify-center'>
        <h1 className='text-center'>Nominator</h1>
        <h3 className='text-center'>Search below to nominate your top 5 favorite movies.</h3>
        <input type='text' value={search} onChange={handleChange} placeholder='Search' className='bg-slate-300'></input>
      </div>
      <div className='container w-10/12 mx-auto text-center text-4xl'>
        {isLoading && "Loading..."}
      </div>
      <h3 className='text-center'>Movies</h3>
      <div className='container mx-auto w-10/12 sm:w-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch'>
        {movies}
      </div>
      <h3 className='text-center'>Nominated Movies {nominate.length}/5</h3>
      <p className='text-center'>{error}</p>
      <div className='container mx-auto w-10/12 sm:w-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch'>
        {nominatedMovies}
      </div>
      <div className='container w-10/12 mx-auto flex items-center justify-center my-5'>
        {nominate.length === 5 && <button className={nominate.includes(winner) ? "hidden" : "bg-slate-300"} onClick={handleReveal}>Reveal Winner</button>}
      </div>
      {winner && <div className='flex flex-col justify-center items-center'>
        <img src={winner.Poster === "N/A" ? "https://picsum.photos/200/300" : winner.Poster} alt={winner.Title + `'s Poster`} className='w-60 h-72'></img>
        <h3>{winner.Title ? winner.Title : "No Title Found"}</h3>
        <p>Year: {winner.Year}</p>
        <strong>Winner</strong>
        <button className='bg-slate-300' onClick={handleRestart}>Restart</button>
      </div>}
    </>
  )
}

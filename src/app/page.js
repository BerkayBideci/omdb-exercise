"use client"
import { useEffect, useState } from 'react'

export default function Home() {

  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [nominate, setNominate] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      if (search.length > 2) {
        const response = await fetch(`http://www.omdbapi.com/?apikey=f771777c&s=${search}`)
        const data = await response.json()
        const manipulatedData = [...data.Search]
        setData(manipulatedData.slice(0, 10))
      } else {
        setData([])
      }
    }
    fetchData()
  }, [search])

  // console.log(data)

  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const handleNominate = (movie) => {
    const isNominated = nominate.some((nominatedMovie) => nominatedMovie.imdbID === movie.imdbID)
    if (!isNominated && nominate.length < 5) {
      setNominate([...nominate, movie])
    } else if (isNominated) {
      setError("Movie is already nominated!")
    } else if (nominate.length === 5) {
      setError("Nominated list can't be more than 5!")
    }
  }

  const handleDismiss = (movie) => {
    const updatedNominations = nominate.filter((nominatedMovie) => nominatedMovie.imdbID !== movie.imdbID);
    setNominate(updatedNominations);
  };

  // console.log("nominate", nominate)

  const movies = data.map((movie) => {
    return (
      <div className='mx-auto my-5' key={movie.imdbID}>
        <img src={movie.Poster === "N/A" ? "https://picsum.photos/200/300" : movie.Poster} alt={movie.Title + `'s Poster`} className=''></img>
        <h3>{movie.Title ? movie.Title : "No Title Found"}</h3>
        <p>Year: {movie.Year}</p>
        <button className='bg-slate-300' onClick={() => handleNominate(movie)}>Nominate</button>
      </div>
    )
  })

  const nominatedMovies = nominate.map((movie) => {
    return (
      <div className='mx-auto my-5' key={movie.imdbID}>
        <img src={movie.Poster === "N/A" ? "https://picsum.photos/200/300" : movie.Poster} alt={movie.Title + `'s Poster`} className=''></img>
        <h3>{movie.Title ? movie.Title : "No Title Found"}</h3>
        <p>Year: {movie.Year}</p>
        <strong>Nominated</strong>
        <button className='bg-slate-300' onClick={() => handleDismiss(movie)}>Dismiss</button>
      </div>
    )
  })

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <input type='text' value={search} onChange={handleChange} placeholder='Search' className='bg-slate-300'></input>
      </div>
      <p className='text-center'>{error}</p>
      <h3 className='text-center'>Movies</h3>
      <div className='container mx-auto w-1/2 grid grid-cols-5 gap-5 items-stretch'>
        {movies}
      </div>
      <h3 className='text-center'>Nominated Movies</h3>
      <div className='container mx-auto w-1/2 grid grid-cols-5 gap-5 items-stretch'>
        {nominatedMovies}
      </div>
    </>
  )
}

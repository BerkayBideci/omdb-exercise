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
      setError(null)

      if (search.trim() !== "" && search.length > 2) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=f771777c&s=${search}`)
        const data = await response.json()
        if (data && data.Search) {
          const manipulatedData = [...data.Search.filter(data => data.Type === "movie")]
          setData(manipulatedData.slice(0, 5))
        } else {
          setError("No movies found.")
        }
      } else if (search.trim() !== "" && search.length >= 1 && search.length <= 2) {
        setError("Too many results. Please adjust your search.")
      } else if (search.trim() === "") {
        setData([])
      }

      setIsLoading(false)
    }

    fetchData()
  }, [search])


  console.log(data)

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
    setError(null)
  }

  const handleRestart = () => {
    location.reload()
  }

  const movies = data.map((movie) => {
    const className = nominate.includes(movie) ? "hidden" : "bg-black text-slate-100 rounded-3xl p-2 mb-3";
    return (
      <div className='flex flex-col justify-stretch items-center shadow-2xl rounded-b-3xl' key={movie.imdbID}>
        <img src={movie.Poster === "N/A" ? "/movieLogo.png" : movie.Poster} alt={movie.Title + `'s Poster`} className='h-72 self-stretch'></img>
        <h3 className='text-center font-bold tracking-wide p-1'>{movie.Title ? movie.Title : "No Title Found"}</h3>
        <p className='text-center p-1'>Year: {movie.Year}</p>
        <button className={className} onClick={() => handleNominate(movie)}>Nominate</button>
      </div>
    )
  })

  const nominatedMovies = nominate.map((movie) => {
    return (
      <div className='flex flex-col justify-stretch items-center shadow-2xl rounded-b-3xl' key={movie.imdbID}>
        <img src={movie.Poster === "N/A" ? "/movieLogo.png" : movie.Poster} alt={movie.Title + `'s Poster`} className='h-72 self-stretch'></img>
        <h3 className='text-center font-bold tracking-wide p-1'>{movie.Title ? movie.Title : "No Title Found"}</h3>
        <p className='text-center p-1'>Year: {movie.Year}</p>
        <strong>Nominated</strong>
        <button className={winner ? "hidden" : "bg-black text-slate-100 rounded-3xl p-2 mb-3"} onClick={() => handleDismiss(movie)}>Dismiss</button>
      </div>
    )
  })

  return (
    <>
      <div className='bg-gradient-to-r from-slate-200 to-slate-500 h-screen'>
        <div className='container w-10/12 mx-auto flex flex-col items-center justify-center py-5'>
          <h1 className='text-center text-4xl font-bold mb-5'>NOMINATOR</h1>
          <h3 className='text-center text-lg font-semibold tracking-wide mb-5'>Search below to nominate your top 5 favorite movies!</h3>
          <input type='text' value={search} onChange={handleChange} placeholder='Search' className='bg-gradient-to-r from-slate-100 to-slate-300 p-2 rounded-3xl font-medium'></input>
        </div>
        <div className='bg-gradient-to-r from-slate-200 to-slate-500 pb-5'>
          <h3 className='text-center text-2xl font-bold'>MOVIES</h3>
          <div className='bg-gradient-to-r from-slate-200 to-slate-500'>
            <div className='container w-10/12 mx-auto text-center text-4xl'>
              {isLoading && (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
          {error === "Too many results. Please adjust your search." && <p className='text-center font-xl font-bold text-red-500 m-3'>{error}</p>}
          {error === "No movies found." && <p className='text-center font-xl font-bold text-red-500 m-3'>{error}</p>}
        </div>
        <div className='bg-gradient-to-r from-slate-200 to-slate-500 pb-5'>
          <div className='container mx-auto w-10/12 sm:w-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch'>
            {movies}
          </div>
        </div>
        <div className='bg-gradient-to-r from-slate-200 to-slate-500 pb-5'>
          <div className='container mx-auto w-10/12'>
            <h3 className='text-center text-2xl font-bold'>NOMINATED MOVIES {nominate.length}/5</h3>
            {error === "Nominated list can't include more than 5 movies!" && <p className='text-center font-xl font-bold text-red-500 my-1'>{error}</p>}
          </div>
        </div>
        <div className='bg-gradient-to-r from-slate-200 to-slate-500'>
          <div className='container mx-auto w-10/12 sm:w-4/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch'>
            {nominatedMovies}
          </div>
        </div>
        <div className='bg-gradient-to-r from-slate-200 to-slate-500 py-5'>
          <div className='container w-10/12 mx-auto flex items-center justify-center'>
            {nominate.length === 5 && <button className={nominate.includes(winner) ? "hidden" : "bg-black text-slate-100 rounded-3xl p-2"} onClick={handleReveal}>Reveal Winner</button>}
          </div>
        </div>
        <div className='bg-gradient-to-r from-slate-200 to-slate-500 py-5'>
          {winner && <div className='flex flex-col justify-stretch items-center shadow-2xl rounded-b-3xl w-60 mx-auto'>
            <img src={winner.Poster === "N/A" ? "/movieLogo.png" : winner.Poster} alt={winner.Title + `'s Poster`} className='h-72 self-stretch'></img>
            <h3 className='text-center font-bold tracking-wide p-1'>{winner.Title ? winner.Title : "No Title Found"}</h3>
            <p className='text-center p-1'>Year: {winner.Year}</p>
            <strong>Winner</strong>
            <button className='bg-black text-slate-100 rounded-3xl p-2 mb-3' onClick={handleRestart}>Restart</button>
          </div>}
        </div>
      </div>
    </>
  )
}

import React, { useState, useEffect, useMemo } from 'react'
import { getSongs, getMoreSongs } from '../../services/Service'
import { SearchInput } from '../SearchInput.js'
import { Song } from './Song'
import loadingGif from './../../assets/loader.gif'
import './Song.css'
import { ImageSong } from './ImageSong'

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const SongsList = ({ artistId }) => {
  const [songs, setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [randomImages, setRandomImages] = useState([])
  const [showButton, setShowButton] = useState(true)
  const [limit, setLimit] = useState(10)

  const filteredSongs = useMemo(() => {
    if (searchText === '') return songs

    return songs.filter((song) => song.title.toLowerCase().includes(searchText.toLowerCase()))
  }, [searchText, songs])

  const handleClickGetMoreSongs = async () => {
    const valueSong = await getMoreSongs({
      artistId,
      limit,
      onStart: () => setIsLoading(true),
      onChangeLimit: (newLimit) => setLimit(newLimit),
      onHiddenButton: () => setShowButton(false),
    })

    setSongs(valueSong)
  }

  useEffect(() => {
    if (artistId) {
      const getValueSongs = async () => {
        const valueSong = await getSongs(artistId)

        setSongs(valueSong)
      }

      getValueSongs()

      return
    }

    setSongs([])
  }, [artistId])

  useEffect(() => {
    const getRandomImg = async () => {
      for (const [index] of filteredSongs.entries()) {
        const randomNumber = generateRandomNumber(10, 35)
        const url = `https://picsum.photos/id/${randomNumber}/150/50`
        const urlModal = `https://picsum.photos/id/${randomNumber}/215/215`

        const verifyIfExistsIndex = randomImages.find((img) => img.index === index)

        if (!verifyIfExistsIndex) {
          setRandomImages((randomImages) => [...randomImages, { url, urlModal, index }])
        }
      }
    }

    getRandomImg()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSongs])

  useEffect(() => {
    if (isLoading) {
      const loading = setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      return () => clearTimeout(loading)
    }
  }, [isLoading])

  return (
    <div className="list row justify-content-center" id="container-song">
      <SearchInput valueSearch={searchText} onChangeSearch={(value) => setSearchText(value)} />

      {filteredSongs && filteredSongs.length > 0 && (
        <div className="col-md-12">
          <ul className="list-group" id="list-song">
            {filteredSongs.map((song, index) => (
              <li className="list-group-item" key={song.id} data-testid="list-songs">
                <div
                  className="list row align-items-center song-item"
                  role="presentation"
                  data-testid="song-item"
                  onClick={() => {
                    setCurrentSong(song)
                    setCurrentImage(randomImages[index]?.urlModal)

                    setIsOpenModal(true)
                  }}
                >
                  <div className="col-md-3 col-sm-12">
                    <ImageSong valueImg={randomImages[index]?.url} />
                  </div>

                  <div className="col-md-7 fw-bold col-sm-12">{song.title}</div>

                  <div className="col-md-2 col-sm-12">{song.release_date}</div>
                </div>
              </li>
            ))}
          </ul>

          <div id="load-more">
            {isLoading ? (
              <img src={loadingGif} alt="loading..." data-testid="loading" />
            ) : (
              <>
                {showButton && (
                  <button data-testid="load-more-button" onClick={handleClickGetMoreSongs}>
                    load more
                  </button>
                )}
              </>
            )}
          </div>

          {currentSong && (
            <Song
              song={currentSong}
              isOpenModal={isOpenModal}
              currentImage={currentImage}
              onClose={() => {
                setCurrentSong(null)
                setCurrentImage(null)
                setIsOpenModal(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

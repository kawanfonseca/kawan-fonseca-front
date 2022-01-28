import React, { useState, useEffect } from 'react'
import { getSingerByTitle, getSingers } from '../../services/Service'
import { SearchInput } from '../SearchInput.js'
import './SingersList.css'

export const SingersList = () => {
  const [singers, setSingers] = useState([])
  const [searchTitle, setSearchTitle] = useState('')

  useEffect(() => {
    if (searchTitle) {
      const getValueSingerByTitle = async () => {
        const data = await getSingerByTitle(searchTitle)

        setSingers(data)
      }

      getValueSingerByTitle()

      return
    }

    setSingers([])
  }, [searchTitle])

  useEffect(() => {
    const getValueSingers = async () => {
      const data = await getSingers()

      setSingers(data)
    }

    getValueSingers()
  }, [])

  return (
    <div className="list row justify-content-center" id="container-singers">
      <SearchInput valueSearch={searchTitle} onChangeSearch={(value) => setSearchTitle(value)} />

      {searchTitle && singers && singers.length > 0 && (
        <div className="col-md-8">
          <ul id="list-singers" className="list-group">
            {singers.map((singer) => (
              <a href={`http://localhost:8081/musicas/${singer.id}`} key={singer.id}>
                <li className="list-group-item" data-testid="singer">
                  {singer.username}
                </li>
              </a>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

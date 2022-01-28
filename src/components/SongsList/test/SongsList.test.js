import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import { SongsList } from '..'
import userEvent from '@testing-library/user-event'

jest.unmock('axios')

import MockAdapter from 'axios-mock-adapter'
import { getSongs, getMoreSongs } from '../../../services/Service.js'
import { songs, songsByTitle, songsLoadMore } from '../../../utils/testValues'

describe('should ensure SongsList is working properly', () => {
  let mock

  beforeAll(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.reset()
  })

  it('should ensure all songs from id 1 are loading', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)

    const { container } = render(<SongsList artistId={1} />)

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs('1')
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    await waitFor(() => {
      const ul = container.querySelector('ul')

      expect(ul).toBeInTheDocument()
    })

    const li = await screen.findAllByTestId('list-songs')

    expect(li).toHaveLength(5)

    expect(li[0]).toHaveTextContent(songs[0].title)
    expect(li[1]).toHaveTextContent(songs[1].title)
    expect(li[2]).toHaveTextContent(songs[2].title)
    expect(li[3]).toHaveTextContent(songs[3].title)
    expect(li[4]).toHaveTextContent(songs[4].title)
  })

  it('should ensure that when clicking on a song, open the modal and then it is possible to click on the button and close the modal', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)

    const { container } = render(<SongsList artistId={1} />)

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs('1')
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    await waitFor(() => {
      const ul = container.querySelector('ul')

      expect(ul).toBeInTheDocument()
    })

    const li = await screen.findAllByTestId('list-songs')

    expect(li).toHaveLength(5)

    expect(li[0]).toHaveTextContent(songs[0].title)
    expect(li[1]).toHaveTextContent(songs[1].title)
    expect(li[2]).toHaveTextContent(songs[2].title)
    expect(li[3]).toHaveTextContent(songs[3].title)
    expect(li[4]).toHaveTextContent(songs[4].title)

    const songItem = await screen.findAllByTestId('song-item')

    expect(songItem).toHaveLength(5)

    expect(songItem[0]).toHaveTextContent(songs[0].title)

    userEvent.click(songItem[0])

    await waitFor(() => screen.getByText(songs[0].description))

    const modal = screen.getByTestId('modal-song')

    expect(modal).toBeInTheDocument()

    expect(modal).toHaveTextContent(songs[0].title)

    const modalHeader = screen.getByTestId('modal-song-header')

    expect(modalHeader).toBeInTheDocument()

    const modalCloseButton = modalHeader.querySelector('button')

    expect(modalCloseButton).toBeInTheDocument()

    userEvent.click(modalCloseButton)

    expect(modal).not.toBeInTheDocument()
  })

  it('should ensure that the laod more button is working', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)

    render(<SongsList artistId={1} />)

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs('1')
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    await waitFor(() => {
      expect(screen.getByText(songs[0].title)).toBeInTheDocument()
    })

    const li = await screen.findAllByTestId('list-songs')

    expect(li).toHaveLength(5)

    expect(li[0]).toHaveTextContent(songs[0].title)
    expect(li[1]).toHaveTextContent(songs[1].title)
    expect(li[2]).toHaveTextContent(songs[2].title)
    expect(li[3]).toHaveTextContent(songs[3].title)
    expect(li[4]).toHaveTextContent(songs[4].title)

    const loadMoreButton = screen.getByTestId('load-more-button')

    expect(loadMoreButton).toBeInTheDocument()

    userEvent.click(loadMoreButton)

    await waitFor(() => {
      const loading = screen.getByTestId('loading')

      expect(loading).toBeInTheDocument()
      expect(loadMoreButton).not.toBeInTheDocument()
    })
  })

  it('should ensure that when typing "l" in the input, do a search and bring the songs that contain "l" in the title', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)

    const { container } = render(<SongsList artistId={1} />)

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs('1')
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    userEvent.click(input)
    userEvent.type(input, 'l')

    expect(input).toHaveValue('l')

    await waitFor(() => {
      const ul = container.querySelector('ul')

      expect(ul).toBeInTheDocument()
    })

    const li = await screen.findAllByTestId('list-songs')

    expect(li).toHaveLength(2)

    expect(li[0]).toHaveTextContent(songsByTitle[0].title)
    expect(li[1]).toHaveTextContent(songsByTitle[1].title)
  })

  it("should ensure that when typing 'f' in the input, it does a search and doesn't bring any song", async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)

    const { container } = render(<SongsList artistId={1} />)

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs('1')
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    userEvent.click(input)
    userEvent.type(input, 'f')

    expect(input).toHaveValue('f')

    const ul = container.querySelector('ul')

    expect(ul).not.toBeInTheDocument()

    const li = container.querySelector('li')

    expect(li).not.toBeInTheDocument()
  })

  it("should ensure it doesn't contain any value in getSongs", async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(204, [])

    const { container } = render(<SongsList artistId={1} />)

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs('1')
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual([])

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    const ul = container.querySelector('ul')

    expect(ul).not.toBeInTheDocument()

    const li = container.querySelector('li')

    expect(li).not.toBeInTheDocument()
  })

  it('should ensure error 404 occurs in getSongs', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=undefined`).reply(404, [])

    const { container } = render(<SongsList />)

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs()
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=undefined`)
    expect(responseSongs).toEqual([])

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    const ul = container.querySelector('ul')

    expect(ul).not.toBeInTheDocument()

    const li = container.querySelector('li')

    expect(li).not.toBeInTheDocument()
  })

  it('should ensure all song from id 1 are loading with limit 10', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)
    mock.onGet(`http://localhost:8080/musicas?user_id=1&limit=10`).reply(200, songsLoadMore)

    const { container } = render(<SongsList artistId={1} />)

    let responseSongs

    let responseSongsLoadMore

    await act(async () => {
      responseSongs = await getSongs('1')

      responseSongsLoadMore = await getMoreSongs({
        onStart: jest.fn(),
        onChangeLimit: jest.fn(),
        onHiddenButton: jest.fn(),
        artistId: '1',
        limit: 10,
      })
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    await waitFor(() => {
      expect(screen.getByText(songs[0].title)).toBeInTheDocument()
    })

    const li = container.querySelector('li')

    expect(li).toBeInTheDocument()

    const loadMoreButton = screen.getByTestId('load-more-button')

    expect(loadMoreButton).toBeInTheDocument()

    userEvent.click(loadMoreButton)

    expect(mock.history.get[2].url).toEqual(`http://localhost:8080/musicas?user_id=1&limit=10`)
    expect(responseSongsLoadMore).toEqual(songsLoadMore)

    await waitFor(() => {
      expect(screen.getByText(songs[0].title)).toBeInTheDocument()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 2050))
    })

    expect(container.querySelector('#load-more').firstChild).toBe(null)

    expect(li).toBeInTheDocument()

    const liLoadMore = await screen.findAllByTestId('list-songs')

    expect(liLoadMore).toHaveLength(7)

    expect(liLoadMore[0]).toHaveTextContent(songsLoadMore[0].title)
    expect(liLoadMore[1]).toHaveTextContent(songsLoadMore[1].title)
    expect(liLoadMore[2]).toHaveTextContent(songsLoadMore[2].title)
    expect(liLoadMore[3]).toHaveTextContent(songsLoadMore[3].title)
    expect(liLoadMore[4]).toHaveTextContent(songsLoadMore[4].title)
    expect(liLoadMore[5]).toHaveTextContent(songsLoadMore[5].title)
    expect(liLoadMore[6]).toHaveTextContent(songsLoadMore[6].title)
  })

  it("should ensure it doesn't contain any value in getMoreSongs", async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)
    mock.onGet(`http://localhost:8080/musicas?user_id=1&limit=10`).reply(204, [])

    const { container } = render(<SongsList artistId={1} />)

    let responseSongs

    let responseSongsLoadMore

    await act(async () => {
      responseSongs = await getSongs('1')

      responseSongsLoadMore = await getMoreSongs({
        onStart: jest.fn(),
        onChangeLimit: jest.fn(),
        onHiddenButton: jest.fn(),
        artistId: '1',
      })
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    await waitFor(() => {
      expect(screen.getByText(songs[0].title)).toBeInTheDocument()
    })

    const li = container.querySelector('li')

    expect(li).toBeInTheDocument()

    const loadMoreButton = screen.getByTestId('load-more-button')

    expect(loadMoreButton).toBeInTheDocument()

    userEvent.click(loadMoreButton)

    expect(mock.history.get[2].url).toEqual(`http://localhost:8080/musicas?user_id=1&limit=5`)
    expect(responseSongsLoadMore).toEqual([])

    await waitFor(() => {
      expect(screen.getByText(songs[0].title)).toBeInTheDocument()
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 2050))
    })

    expect(container.querySelector('ul')).not.toBeInTheDocument()

    expect(li).not.toBeInTheDocument()
  })

  it('should ensure that getMoreSongs returns a value of the same size as the limit', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)
    mock.onGet(`http://localhost:8080/musicas?user_id=1&limit=5`).reply(200, songs)

    render(<SongsList artistId={1} />)

    let responseSongs

    let responseSongsLoadMore

    await act(async () => {
      responseSongs = await getSongs('1')

      responseSongsLoadMore = await getMoreSongs({
        onStart: jest.fn(),
        onChangeLimit: jest.fn(),
        onHiddenButton: jest.fn(),
        artistId: '1',
      })
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
    expect(responseSongs).toEqual(songs)

    expect(mock.history.get[2].url).toEqual(`http://localhost:8080/musicas?user_id=1&limit=5`)
    expect(responseSongsLoadMore).toEqual(songs)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    expect(input).toHaveValue('')

    await waitFor(() => {
      expect(screen.getByText(songs[0].title)).toBeInTheDocument()
    })

    const li = await screen.findAllByTestId('list-songs')

    expect(li).toHaveLength(5)

    expect(li[0]).toHaveTextContent(songs[0].title)
    expect(li[1]).toHaveTextContent(songs[1].title)
    expect(li[2]).toHaveTextContent(songs[2].title)
    expect(li[3]).toHaveTextContent(songs[3].title)
    expect(li[4]).toHaveTextContent(songs[4].title)
  })
})

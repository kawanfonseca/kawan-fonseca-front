import React from 'react'
import Axios from 'axios'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { getSingers, getSingerByTitle, getSongs } from './services/Service'
import { singers, singersByTitle, songs } from './utils/testValues'
import App from './App'

jest.unmock('axios')

import MockAdapter from 'axios-mock-adapter'

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return render(ui, { wrapper: BrowserRouter })
}

describe('Application root', () => {
  let mock

  beforeAll(() => {
    mock = new MockAdapter(Axios)
  })

  afterEach(() => {
    mock.reset()
  })

  it('renders page /', async () => {
    mock.onGet(`http://localhost:8080/artistas`).reply(200, singers)

    const { container } = render(<App />)

    let responseSingers

    await act(async () => {
      responseSingers = await getSingers()
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/artistas`)
    expect(responseSingers).toEqual(singers)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    userEvent.click(input)
    userEvent.type(input, 'P')

    expect(input).toHaveValue('P')

    mock.onGet(`http://localhost:8080/artistas?username=P`).reply(200, singersByTitle)

    let responseSingerByTitle

    await act(async () => {
      responseSingerByTitle = await getSingerByTitle('P')
    })

    await waitFor(() => {
      const ul = container.querySelector('ul')

      expect(ul).toBeInTheDocument()
    })

    expect(mock.history.get[2].url).toEqual(`http://localhost:8080/artistas?username=P`)
    expect(responseSingerByTitle).toEqual(singersByTitle)

    const li = await screen.findAllByTestId('singer')

    expect(li).toHaveLength(2)
    expect(li[0]).toHaveTextContent(singersByTitle[0].username)
    expect(li[1]).toHaveTextContent(singersByTitle[1].username)
  })

  it('renders page /musicas/1', async () => {
    mock.onGet(`http://localhost:8080/musicas?user_id=1`).reply(200, songs)

    const route = '/musicas/1'

    const { container } = renderWithRouter(<App />, { route })

    let responseSongs

    await act(async () => {
      responseSongs = await getSongs('1')
    })

    expect(mock.history.get[1].url).toEqual(`http://localhost:8080/musicas?user_id=1`)
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
})

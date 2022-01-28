import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import { SingersList } from '..'
import userEvent from '@testing-library/user-event'
import { singers, singersByTitle } from '../../../utils/testValues'

jest.unmock('axios')

import MockAdapter from 'axios-mock-adapter'
import { getSingers, getSingerByTitle } from '../../../services/Service.js'

describe('should ensure SingersList is working properly', () => {
  let mock

  beforeAll(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.reset()
  })

  it('should ensure the input is being rendered', async () => {
    const promise = Promise.resolve()

    mock.onGet(`http://localhost:8080/artistas`).reply(200, singers)

    render(<SingersList />)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    await act(() => promise)
  })

  it('should ensure that the input is getting the value "P" and that getSingerByTitle is getting the correct values', async () => {
    mock.onGet(`http://localhost:8080/artistas`).reply(200, singers)

    const { container } = render(<SingersList />)

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

  it('should ensure that the input is getting the value "W" and that getSingerByTitle is not bringing any value', async () => {
    mock.onGet(`http://localhost:8080/artistas`).reply(200, singers)

    const { container } = render(<SingersList />)

    let responseSingers

    await act(async () => {
      responseSingers = await getSingers()
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/artistas`)
    expect(responseSingers).toEqual(singers)

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    userEvent.click(input)
    userEvent.type(input, 'W')

    expect(input).toHaveValue('W')

    mock.onGet(`http://localhost:8080/artistas?username=W`).reply(204, [])

    let responseSingerByTitle

    await act(async () => {
      responseSingerByTitle = await getSingerByTitle('W')
    })

    const ul = container.querySelector('ul')

    expect(ul).not.toBeInTheDocument()

    expect(mock.history.get[2].url).toEqual(`http://localhost:8080/artistas?username=W`)
    expect(responseSingerByTitle).toEqual([])

    const li = container.querySelector('li')

    expect(li).not.toBeInTheDocument()
  })

  it('should ensure that getSingers and getSingersByTitle are not bringing any value', async () => {
    mock.onGet(`http://localhost:8080/artistas`).reply(204, [])

    const { container } = render(<SingersList />)

    let responseSingers

    await act(async () => {
      responseSingers = await getSingers()
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/artistas`)
    expect(responseSingers).toEqual([])

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    userEvent.click(input)
    userEvent.type(input, 'W')

    expect(input).toHaveValue('W')

    mock.onGet(`http://localhost:8080/artistas?username=W`).reply(204, [])

    let responseSingerByTitle

    await act(async () => {
      responseSingerByTitle = await getSingerByTitle('W')
    })

    const ul = container.querySelector('ul')

    expect(ul).not.toBeInTheDocument()

    expect(mock.history.get[2].url).toEqual(`http://localhost:8080/artistas?username=W`)
    expect(responseSingerByTitle).toEqual([])

    const li = container.querySelector('li')

    expect(li).not.toBeInTheDocument()
  })

  it('should ensure getSingers and getSingersByTitle are giving error', async () => {
    mock.onGet(`http://localhost:8080/artistas`).reply(404, [])

    const { container } = render(<SingersList />)

    let responseSingers

    await act(async () => {
      responseSingers = await getSingers()
    })

    expect(mock.history.get[0].url).toEqual(`http://localhost:8080/artistas`)
    expect(responseSingers).toEqual([])

    const input = screen.getByPlaceholderText('Search by title')

    expect(input).toBeInTheDocument()

    userEvent.click(input)
    userEvent.type(input, 'W')

    expect(input).toHaveValue('W')

    mock.onGet(`http://localhost:8080/artistas?username=W`).reply(404, [])

    let responseSingerByTitle

    await act(async () => {
      responseSingerByTitle = await getSingerByTitle('W')
    })

    const ul = container.querySelector('ul')

    expect(ul).not.toBeInTheDocument()

    expect(mock.history.get[2].url).toEqual(`http://localhost:8080/artistas?username=W`)
    expect(responseSingerByTitle).toEqual([])

    const li = container.querySelector('li')

    expect(li).not.toBeInTheDocument()
  })
})

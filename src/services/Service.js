import axios from 'axios'

export const getSingers = async () => {
  try {
    const resp = await axios.get('http://localhost:8080/artistas')

    if (resp?.status !== 200) {
      return []
    }

    const data = await resp.data

    return data
  } catch (error) {
    return []
  }
}

export const getSingerByTitle = async (title) => {
  try {
    const resp = await axios.get(`http://localhost:8080/artistas?username=${title}`)

    if (resp?.status !== 200) {
      return []
    }

    const data = await resp.data

    return data
  } catch (error) {
    return []
  }
}

export const getSongs = async (id) => {
  try {
    const resp = await axios.get(`http://localhost:8080/musicas?user_id=${id}`)

    if (resp?.status !== 200) {
      return []
    }

    const data = await resp.data

    return data
  } catch (error) {
    return []
  }
}

export const getMoreSongs = async ({
  onStart,
  onHiddenButton,
  onChangeLimit,
  artistId,
  limit = 5,
}) => {
  try {
    onStart()

    const url = `http://localhost:8080/musicas?user_id=${artistId}&limit=${limit}`

    const resp = await axios.get(url)

    if (resp?.status !== 200) {
      return []
    }

    const data = await resp.data

    if (data.length < limit) {
      onHiddenButton()
    }

    onChangeLimit(limit + 5)

    return data
  } catch (error) {
    return []
  }
}

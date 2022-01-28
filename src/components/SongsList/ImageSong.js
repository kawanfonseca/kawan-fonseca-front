import React from 'react'

export const ImageSong = ({ valueImg = 'https://picsum.photos/id/1/200/300' }) => {
  return <img src={valueImg} alt="pink floyd" className="image-song" />
}

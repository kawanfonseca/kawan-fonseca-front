import React from 'react'
import { Modal } from 'react-bootstrap'
import { ImageSong } from './ImageSong'

export const Song = ({ song, currentImage, onClose, isOpenModal }) => {
  return (
    <Modal show={isOpenModal} backdrop="static" data-testid="modal-song">
      <Modal.Header closeButton onHide={() => onClose()} data-testid="modal-song-header" />

      <Modal.Body>
        <div className="list row justify-content-center">
          <div className="col-md-4 col-sm-12">
            <ImageSong valueImg={currentImage} />
          </div>

          <div className="col-md-8 col-sm-12">
            <h4 className="text-muted">{song.username}</h4>
            <h2>{song.title}</h2>
            <h5 className="text-muted mb-4">{song.release_date}</h5>
            <p>{song.description}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

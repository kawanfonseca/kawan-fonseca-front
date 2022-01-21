import React from "react";
import { Modal } from "react-bootstrap";

export const Song = ({ song, onClose, isOpenModal }) => {
  return (
    <Modal show={isOpenModal} onHide={() => onClose()}>
      <Modal.Header closeButton />

      <Modal.Body>
        <div className="list row justify-content-center">
          <div className="col-md-4 col-sm-12">
            <img src="https://picsum.photos/seed/picsum/150/150" />
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
  );
};

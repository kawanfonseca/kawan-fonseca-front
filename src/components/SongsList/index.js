import React, { useState, useEffect, useMemo } from "react";
import DataService from "../../services/Service";
import { Song } from "./Song";

export const SongsList = ({ artistId }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const filteredSongs = useMemo(() => {
    if (searchText === "") return songs;

    return songs.filter((song) =>
      song.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, songs]);

  useEffect(() => {
    DataService.getSongs(artistId).then((response) => {
      if (!Array.isArray(response.data)) throw new Error("data is not array!");

      setSongs(response.data);
    });
  }, [artistId]);

  return (
    <div className="list row justify-content-center">
      <div className="col-md-8 col-sm-12">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control border-radius-lg"
            placeholder="Search by title"
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
          />
        </div>
      </div>

      <div className="col-md-12" style={{ cursor: "pointer" }}>
        <ul className="list-group">
          {filteredSongs.map((song) => (
            <li
              className={"list-group-item"}
              key={song.id}
              onClick={() => {
                setCurrentSong(song);

                setIsOpenModal(true);
              }}
            >
              <div className="list row align-items-center">
                <div className="col-md-3 col-sm-12">
                  <img src="https://picsum.photos/seed/picsum/100/50" />
                </div>

                <div className="col-md-7 fw-bold col-sm-12">{song.title}</div>

                <div className="col-md-2 col-sm-12">{song.release_date}</div>
              </div>
            </li>
          ))}
        </ul>

        {currentSong && (
          <Song
            song={currentSong}
            isOpenModal={isOpenModal}
            onClose={() => setIsOpenModal(false)}
          />
        )}
      </div>
    </div>
  );
};

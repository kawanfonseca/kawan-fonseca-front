import React, { useState, useEffect } from "react";
import DataService from "../../services/Service";
import { Link } from "react-router-dom";

export const SingersList = () => {
  const [singers, setSingers] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;

    setSearchTitle(searchTitle);

    DataService.getSingerByTitle(searchTitle)
      .then((response) => {
        setSingers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveSingers = () => {
    DataService.getSingers()
      .then((response) => {
        setSingers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveSingers();
  }, []);

  return (
    <div className="list row justify-content-center">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control border-radius-lg"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
        </div>
      </div>

      <div className="col-md-8">
        <ul className="list-group">
          {singers &&
            singers.map((singer) => (
              <Link to={"/musicas/" + singer.id} key={singer.id}>
                <li className={"list-group-item"}>{singer.username}</li>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
};

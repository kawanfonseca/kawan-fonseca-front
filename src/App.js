import React from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { SingersList, SongsList } from "./components";

const App = () => {
  return (
    <div>
      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/artistas"]} component={SingersList} />

          <Route
            path="/musicas/:artistId"
            render={(routeProps) => (
              <SongsList artistId={routeProps.match.params.artistId} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
};

export default App;

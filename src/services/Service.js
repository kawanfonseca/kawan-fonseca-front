import http from "../http-common";

const getSingers = () => {
  return http.get("/artistas");
};

const getSingerByTitle = title => {
  return http.get(`/artistas?username=${title}`);
};

const getSongs = id => {
  return http.get(`/musicas?user_id=${id}`);
};



export default {
  getSingers,
  getSingerByTitle,
  getSongs,
};

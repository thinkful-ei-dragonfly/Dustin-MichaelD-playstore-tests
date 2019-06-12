const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(morgan("dev"));

let playstore = require("./playstore");

app.get("/apps", (req, res) => {
  const { sort, genres } = req.query;

  if (sort || genres) {
    if (genres) {
      if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
        res.status(400).send('not included');
      }
      playstore = playstore.filter(app => {
        return app.Genres.toLowerCase().includes(genres.toLowerCase());
      });
      
    }
    if (sort) {
      if (!["Rating", "App"].includes(sort)) {
        res.status(400).send("Can only sort by Rating or App");
      }
      if (["Rating"].includes(sort)) {
        playstore.sort((a, b) => {
          return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
        });
      } else {
        playstore.sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
      }
    }  
  }

  res.send(playstore);
});

app.listen(8080, () => {
  console.log("Server is up and running on localhost:8080");
});

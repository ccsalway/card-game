const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');

const db = new sqlite3.Database(':memory:', (err) => {
   if (err) throw err;
});

db.run(`CREATE TABLE players (id text, owner text)`, err => {
   if (err) throw err;
})

let getPlayers = async (owner) => {
   return new Promise((resolve, reject) => {
      db.all("SELECT * FROM players WHERE owner = ?", [owner], (err, rows) => {
         if (err) reject(err);
         resolve(rows);
      });
   });
};

let addPlayer = async (id, owner) => {
   return new Promise((resolve, reject) => {
      db.run("INSERT INTO players (id, owner) VALUES (?, ?)", [id, owner], (err) => {
         if (err) reject(err);
         resolve('ok');
      });
   });
};

const app = express();
app.use(cors({
   origin: '*'
}));

app.get('/players', async (req, res, next) => {
   try {
      let owner = req.query.owner.toLowerCase();
      let players = await getPlayers(owner);
      res.end(JSON.stringify(players));
   } catch (err) {
      next(err);
   }
})

app.get('/players/add', async (req, res, next) => {
   try {
      let id = req.query.id.toLowerCase();
      let owner = req.query.owner.toLowerCase();
      let result = await addPlayer(id, owner);
      res.end(JSON.stringify(result));
   }
   catch (err) {
      next(err);
   }
})

var server = app.listen(8090, () => {
   var host = server.address().address
   var port = server.address().port
   console.log("Listening on http://%s:%s", host, port)
})
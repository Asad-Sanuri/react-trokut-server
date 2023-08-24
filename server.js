const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./server/controllers/register");
const signin = require("./server/controllers/signin");
const triangle = require("./server/controllers/triangle");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Disabling Node's rejection of invalid/unauthorised certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: "pg",
  connection: {
    host: "dpg-cjhumc337aks73eq60l0-a",
    port: 5432,
    user: "react_trokut_db_user",
    password: process.env.DB_PASS,
    database: "react_trokut_db",
    ssl: true,
  },
});

app.get("home", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.put("/triangle", (req, res) => {
  triangle.handleTriangle(req, res, db);
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});

/* 
-----------OVAKO SAM POSLAO DATA S FRONTENDA U DATABASE--------
app.post("/triangle", (req, res) => {
  const { userId, vertex1, vertex2, vertex3 } = req.body;

  db.transaction((trx) => {
    trx
      .insert({
        user_id: userId,
        vertex1_x: vertex1.x,
        vertex1_y: vertex1.y,
        vertex2_x: vertex2.x,
        vertex2_y: vertex2.y,
        vertex3_x: vertex3.x,
        vertex3_y: vertex3.y,
      })
      .into("user_triangles")
      .returning("*")
      .then((triangle) => {
        return trx("users")
          .where("id", userId)
          .increment("triangles", 1)
          .returning("triangles")
          .then((trianglesCount) => {
            res.json({
              triangle: triangle[0],
              trianglesCount: trianglesCount[0],
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((error) => {
    console.error(error);
    res.status(500).json("Error adding triangle");
  });
}); 
-----------------------------------------------------------
*/

/*
------------OVO JE TREBALO BITI ZA DOHVAT ODREĐENIH TROKUTA-------
app.get("/user/:userId/triangles", (req, res) => {
  const userId = req.params.userId;

  db.select("*")
    .from("user_triangles")
    .where("user_id", userId)
    .then((triangles) => {
      res.json(triangles);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json("Error fetching user triangles");
    });
});
----------------------------------------------------------------
 */

const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;
const nunjucks = require("nunjucks");

// database configuration
const Pool = require("pg").Pool;
const db = new Pool({
  user: "postgres",
  password: "0000",
  host: "localhost",
  port: 5432,
  database: "doe"
});

// configure  show files extras
server.use(express.static("public"));

// enable body form
server.use(
  express.urlencoded({
    extended: true
  })
);
// templete engine configuration
nunjucks.configure("./", {
  express: server,
  noCache: true
});
// show configuration of the page, send obj donors
server.get("/", (req, res) => {
  db.query("SELECT * FROM donors ORDER BY ID DESC LIMIT 5", (err, result) => {
    if (err) return res.send("Erro de banco de dados.");

    const donors = result.rows;
    return res.render("index.html", {
      donors
    });
  });
});

server.post("/", (req, res) => {
  // get data form
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  // validate data
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.");
  }
  // // value in database
  const query = `INSERT INTO donors ("name", "email", "blood") 
                          VALUES ($1,  $2,  $3)`;
  const values = [name, email, blood]
  db.query(query, values, err => {
    if (err) return res.send(err);

    return res.redirect("/");
  });
});
// On server
server.listen(PORT, () => {
  console.log(`Server run in ${PORT}`);
});
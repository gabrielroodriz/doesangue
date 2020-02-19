const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;
const nunjucks = require("nunjucks");

// database configuration
const Pool = require("pg").Pool;
const db = new Pool({
  user: "postman",
  password: "0000",
  host: "localhost",
  port: 5432,
  database: "doe"
});

// donors list
const donors = [
  {
    name: "Melissa Soligo",
    blood: "AB+",
    image: ""
  },
  {
    name: "Gabriel Rodrigues",
    blood: "B-",
    image: ""
  },
  {
    name: "Camila Ribeiro",
    blood: "A+",
    image: ""
  },
  {
    name: "Maria Helena",
    blood: "AB+",
    image: ""
  },
  {
    name: "João Paulo",
    blood: "B+",
    image: ""
  }
  // {
  //     name: "Flávia Costa",
  //     blood: "O+",
  //     image: "",
  // },
  // {
  //     name: "Marcos Fontes",
  //     blood: "O-",
  //     image: "",
  // },
];
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
  db.query("SELECT * FROM donors", (err, result) => {
    if (err) return res.send("Erro de banco de dados.");

    //   const donors = [] result.rows;
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

  // add values in array
  donors.push({
    name: name,
    blood: blood
  });

  // validate data
  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.");
  }
  // value in database
  const query = `INSERT INTO donors ("name", "emai", "blood") VALUES($1, $2, $3))`;
  db.query(query, [name, email, blood], err => {
    if (err) return res.send("Erro o banco de dados.");

    return res.redirect("/");
  });
});
// On server
server.listen(PORT, () => {
  console.log(`Server run in ${PORT}`);
});

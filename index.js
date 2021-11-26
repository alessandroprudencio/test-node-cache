const express = require("express");
const app = express();
const port = 3000;

const NodeCache = require("node-cache");

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

const cacheApp = new NodeCache();

app.get("/", function (req, res) {
  console.log("Stats cache =>", cacheApp.stats);

  // return createFakeRegisters(connection)

  const values = cacheApp.get("todos");

  if (values !== undefined) {
    console.log(`get from cache ${values.length} records`);

    return res.send(values);
  }

  connection.query("SELECT * FROM todos", function (error, results, fields) {
    if (error) throw error;

    console.log(`get from database ${results.length} records`);

    const success = cacheApp.set("todos", results, 100);

    if (success) {
      return res.send(results);
    }
  });
});

function createFakeRegisters(connection) {
  for (let i = 1; i < 10001; i++) {
    const post = { name: `Clear home - ${i}` };

    const query = connection.query(
      "INSERT INTO todos SET ?",
      post,
      function (error, results, fields) {
        if (error) throw error;
      }
    );
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

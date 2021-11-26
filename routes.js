const express = require("express");

var router = express.Router();

const cacheApp = new NodeCache();


router.get("/", function (req, res) {
  const values = cacheApp.get("todos");

  if (values !== undefined) {
    return res.send(values);
  }

  console.log("busca no banco");

  connection.query("SELECT * FROM todos", function (error, results, fields) {
    if (error) return new Error(error);

    const success = cacheApp.set("todos", results, 100);

    if (success) {
      return res.send(results);
    }
  });
});

module.exports = router
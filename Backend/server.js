const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

app.use(cors());
app.use(bodyParser.json());

// Conecta ao banco de dados SQLite
const db = new sqlite3.Database("./apartamentos.db");

app.get("/apartamentos", (req, res) => {
  db.all("SELECT * FROM apartamentos", (err, rows) => {
    if (err) {
      console.error("Erro ao consultar apartamentos:", err);
      res.status(500).send("Erro interno do servidor");
      return;
    }
    res.json(rows);
  });
});

app.post("/apartamentos", (req, res) => {
  const novoApartamento = req.body;
  db.run(
    "INSERT INTO apartamentos (nome, preco, regiao, tamanho, endereco, quartos, banheiros, contato) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      novoApartamento.nome,
      novoApartamento.preco,
      novoApartamento.regiao,
      novoApartamento.tamanho,
      novoApartamento.endereco,
      novoApartamento.quartos,
      novoApartamento.banheiros,
      novoApartamento.contato,
    ],
    function (err) {
      if (err) {
        console.error("Erro ao inserir novo apartamento:", err);
        res.status(500).send("Erro interno do servidor");
        return;
      }
      novoApartamento.id = this.lastID;
      res.status(201).json(novoApartamento);
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

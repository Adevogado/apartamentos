const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

// Aumentar o limite de tamanho do payload para 15MB (ou o tamanho que você desejar)
app.use(bodyParser.json({ limit: "15mb" }));

app.use(cors());

// Configurações do banco de dados MySQL
const dbConfig = {
  host: "871.h.filess.io",
  user: "apartmentDB_soilstrip",
  password: "cc3ba97d47d28fa951bcdd87dcb1f8f676386d63",
  database: "apartmentDB_soilstrip",
  port: 3307,
};

// Cria uma conexão com o banco de dados MySQL
const db = mysql.createConnection(dbConfig);

// Conecta ao banco de dados MySQL
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL");
});

app.get("/apartamentos", (req, res) => {
  // Consulta SQL para selecionar todos os apartamentos
  const query = "SELECT * FROM apartamentos";

  // Executa a consulta
  db.query(query, (err, result) => {
    if (err) {
      console.error("Erro ao consultar apartamentos:", err);
      res.status(500).send("Erro interno do servidor");
      return;
    }
    res.json(result);
  });
});

app.get("/apartamentos/:id", (req, res) => {
  const apartamentoId = req.params.id;

  // Consulta SQL para buscar o apartamento pelo ID
  const query = "SELECT * FROM apartamentos WHERE id = ?";

  // Executa a consulta com o ID fornecido como parâmetro
  db.query(query, [apartamentoId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar apartamento:", err);
      res.status(500).send("Erro interno do servidor");
      return;
    }
    if (result.length === 0) {
      // Se nenhum apartamento for encontrado com o ID fornecido, retornar uma resposta 404
      res.status(404).send("Apartamento não encontrado");
      return;
    }
    // Se o apartamento for encontrado, retorná-lo como JSON
    res.json(result[0]);
  });
});

app.post("/apartamentos", (req, res) => {
  const novoApartamento = req.body;

  // Converter o array de fotos em formato JSON antes de inserir no banco de dados
  novoApartamento.fotos = JSON.stringify(novoApartamento.fotos);

  // Consulta SQL para inserir um novo apartamento
  const query =
    "INSERT INTO apartamentos (nome, preco, regiao, tamanho, endereco, quartos, banheiros, contato, fotos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  // Executa a consulta com os valores do novo apartamento
  db.query(
    query,
    [
      novoApartamento.nome,
      novoApartamento.preco,
      novoApartamento.regiao,
      novoApartamento.tamanho,
      novoApartamento.endereco,
      novoApartamento.quartos,
      novoApartamento.banheiros,
      novoApartamento.contato,
      novoApartamento.fotos,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir novo apartamento:", err);
        res.status(500).send("Erro interno do servidor");
        return;
      }
      novoApartamento.id = result.insertId;

      // Converter a string JSON de volta para um array antes de enviar a resposta
      novoApartamento.fotos = JSON.parse(novoApartamento.fotos);

      res.status(201).json(novoApartamento);
    }
  );
});

app.put("/apartamentos/:id", (req, res) => {
  const apartamentoId = req.params.id;
  const dadosAtualizados = req.body;

  // Converter o array de fotos em formato JSON antes de inserir no banco de dados
  dadosAtualizados.fotos = JSON.stringify(dadosAtualizados.fotos);

  // Consulta SQL para atualizar o apartamento pelo ID
  const query = `
    UPDATE apartamentos
    SET nome = ?, preco = ?, regiao = ?, tamanho = ?, endereco = ?, quartos = ?, banheiros = ?, contato = ?, fotos = ?
    WHERE id = ?
  `;

  // Executa a consulta com os valores atualizados e o ID do apartamento
  db.query(
    query,
    [
      dadosAtualizados.nome,
      dadosAtualizados.preco,
      dadosAtualizados.regiao,
      dadosAtualizados.tamanho,
      dadosAtualizados.endereco,
      dadosAtualizados.quartos,
      dadosAtualizados.banheiros,
      dadosAtualizados.contato,
      dadosAtualizados.fotos,
      apartamentoId,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao atualizar apartamento:", err);
        res.status(500).send("Erro interno do servidor");
        return;
      }

      if (result.affectedRows === 0) {
        // Se nenhum apartamento foi atualizado (ID não encontrado), enviar uma resposta 404
        return res.status(404).send("Apartamento não encontrado");
      }

      res.status(200).send("Apartamento atualizado com sucesso");
    }
  );
});

app.delete("/apartamentos/:id", (req, res) => {
  const apartamentoId = req.params.id;

  // Verificar se o ID do apartamento é um número válido
  if (isNaN(apartamentoId)) {
    return res.status(400).send("ID do apartamento inválido");
  }

  // Consulta SQL para excluir o apartamento pelo ID
  const query = "DELETE FROM apartamentos WHERE id = ?";

  // Executa a consulta com o ID do apartamento
  db.query(query, [apartamentoId], (err, result) => {
    if (err) {
      console.error("Erro ao excluir apartamento:", err);
      return res.status(500).send("Erro interno do servidor");
    }

    if (result.affectedRows === 0) {
      // Se nenhum apartamento foi excluído (ID não encontrado), enviar uma resposta 404
      return res.status(404).send("Apartamento não encontrado");
    }

    res.status(200).send("Apartamento excluído com sucesso");
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

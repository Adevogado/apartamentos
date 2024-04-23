// GERAR BANCO DE DADOS

/*
  O banco de dados foi escrito em mysql
  ele está hospedado no filess.io
*/
// var mysql = require("mysql");

// var hostname = "871.h.filess.io";
// var database = "apartmentDB_soilstrip";
// var port = "3307";
// var username = "apartmentDB_soilstrip";
// var password = "cc3ba97d47d28fa951bcdd87dcb1f8f676386d63";

// var con = mysql.createConnection({
//   host: hostname,
//   user: username,
//   password,
//   database,
//   port,
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");

//   // Array de registros para inserir
//   var apartamentos = [
//     {
//       nome: "Apartamento 1",
//       preco: 2000,
//       regiao: "Centro",
//       tamanho: 100,
//       endereco: "Rua A, 123",
//       quartos: 2,
//       banheiros: 1,

//       contato: "1234567890",
//     },
//     {
//       nome: "Apartamento 2",
//       preco: 3000,
//       regiao: "Contagem",
//       tamanho: 100,
//       endereco: "Rua B, 567",
//       quartos: 2,
//       banheiros: 1,

//       contato: "1234567890",
//     },
//     {
//       nome: "Apartamento 3",
//       preco: 4000,
//       regiao: "BH",
//       tamanho: 100,
//       endereco: "Rua C, 890",
//       quartos: 2,
//       banheiros: 1,

//       contato: "1234567890",
//     },
//     {
//       nome: "Apartamento 4",
//       preco: 1250,
//       regiao: "Serrano",
//       tamanho: 50,
//       endereco: "Avenida 123 bloco B",
//       quartos: 3,
//       banheiros: 2,

//       contato: "",
//     },
//     {
//       nome: "Apartamento 5",
//       preco: 1245,
//       regiao: "Cabral",
//       tamanho: 1,
//       endereco: "rua teste 123",
//       quartos: 1,
//       banheiros: 1,

//       contato: "031997707130",
//     },
//   ];

//   // Loop sobre os apartamentos e inserir cada um no banco de dados
//   apartamentos.forEach(function (apartamento) {
//     var insertQuery = `
//           INSERT INTO apartamentos (nome, preco, regiao, tamanho, endereco, quartos, banheiros, fotos, contato)
//           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//     var values = [
//       apartamento.nome,
//       apartamento.preco,
//       apartamento.regiao,
//       apartamento.tamanho,
//       apartamento.endereco,
//       apartamento.quartos,
//       apartamento.banheiros,
//       apartamento.fotos,
//       apartamento.contato,
//     ];

//     // Executar a consulta de inserção
//     con.query(insertQuery, values, function (err, result) {
//       if (err) throw err;
//       console.log("Registro inserido com sucesso:", result.insertId);
//     });
//   });

//   con.end();
// });

// EXEMPLO DE CÓDIGO PRA SE CONECTAR AO BANCO
var mysql = require("mysql");

var hostname = "871.h.filess.io";
var database = "apartmentDB_soilstrip";
var port = "3307";
var username = "apartmentDB_soilstrip";
var password = "cc3ba97d47d28fa951bcdd87dcb1f8f676386d63";

var con = mysql.createConnection({
  host: hostname,
  user: username,
  password,
  database,
  port,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // Consulta SQL para selecionar todos os registros da tabela
  var selectQuery = "SELECT * FROM apartamentos";

  // Executa a consulta
  con.query(selectQuery, function (err, result) {
    if (err) throw err;
    console.log("Registros retornados:", result);

    // Processar os resultados aqui
  });
});

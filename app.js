// app.js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const quizRoutes = require("./routes/quizRoutes");
const morgan = require("morgan"); //logging

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());

app.use(morgan("dev"));

// Se quiser servir arquivos estáticos (CSS, JS) na pasta "public"
app.use(express.static("public"));

// Registra as rotas relacionadas ao quiz
app.use("/", quizRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

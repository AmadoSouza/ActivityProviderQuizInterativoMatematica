// app.js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const quizRoutes = require("./routes/quizRoutes");
const morgan = require("morgan");

const app = express();

// Configura o EJS como engine de views e define a pasta de views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(morgan("dev"));

// Servir arquivos estáticos (ex: CSS, JS) da pasta "public"
app.use(express.static("public"));

// Registra as rotas relacionadas ao quiz
app.use("/", quizRoutes);

// Define a porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

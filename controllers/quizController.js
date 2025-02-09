// controllers/quizController.js
const path = require("path");
const uuid = require("uuid");
const analyticsObserver = require("../observers/analyticsObserver");

// Importa o "banco de dados" em memória
const { quizzes, respostas } = require("../models/quizModel");

// 1. Exibe a página de configuração do quiz (renderiza a view configuracao-quiz.ejs)
exports.getHome = (req, res) => {
  res.render("configuracao-quiz");
};

// Alias para getHome, garantindo que getConfigPage esteja definida
exports.getConfigPage = exports.getHome;

// 2. Fornece os parâmetros JSON do quiz
exports.getJsonParamsQuiz = (req, res) => {
  res.json([
    { name: "nivel_dificuldade", type: "text/plain" },
    { name: "topicos", type: "text/plain" },
    { name: "alunos", type: "text/plain" },
    { name: "perguntas", type: "application/json" },
  ]);
};

// 3. Faz o deploy do quiz (salva a configuração e gera links únicos)
exports.deployQuiz = (req, res) => {
  console.log("Recebendo dados do formulário:", req.body);
  const { nivel_dificuldade, topicos, alunos, perguntas } = req.body;

  if (
    !nivel_dificuldade ||
    !topicos ||
    !alunos ||
    alunos.length === 0 ||
    !perguntas ||
    perguntas.length === 0
  ) {
    console.error("Dados incompletos recebidos");
    return res.status(400).json({ message: "Dados incompletos" });
  }

  console.log("Perguntas recebidas:", perguntas);

  // Gera URLs únicas para cada aluno
  const quizURLs = alunos.map((aluno) => {
    const alunoID = uuid.v4();
    quizzes[alunoID] = { perguntas };
    return `http://${req.hostname}/quiz?aluno=${alunoID}`;
  });

  res.json({
    message: "Quiz configurado com sucesso!",
    quizURLs,
  });
};

// 4. Exibe o quiz para o aluno (renderiza a view quiz.ejs)
exports.getQuiz = (req, res) => {
  const alunoID = req.query.aluno;
  const quizData = quizzes[alunoID];

  if (!quizData) {
    return res.status(404).render("error", { message: "Quiz não encontrado" });
  }

  res.render("quiz", { quizData, alunoID });
};

// 5. Recebe as respostas dos alunos
exports.submitQuiz = (req, res) => {
  const { alunoID, respostas: respostasAluno } = req.body;

  if (!alunoID || !respostasAluno) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  respostas[alunoID] = respostasAluno;
  const perguntasDoAluno = quizzes[alunoID]?.perguntas || [];

  analyticsObserver.emit("novaResposta", {
    alunoID,
    respostasAluno,
    perguntas: perguntasDoAluno,
  });

  console.log("Respostas recebidas:", respostasAluno);
  res.json({ message: "Respostas recebidas com sucesso!" });
};

// 6. Exibe a página de analytics (renderiza a view analytics.ejs)
exports.getAnalytics = (req, res) => {
  res.render("analytics", { analyticsData: respostas });
};

// 7. Fornece os dados analíticos em formato JSON
exports.getAnalyticsData = (req, res) => {
  res.json(respostas);
};

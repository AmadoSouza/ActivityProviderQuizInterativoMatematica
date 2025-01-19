// /routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// Rotas

// 1. Página inicial (outra forma de acessar a config do quiz)
router.get("/", quizController.getHome);

// 2. Página de configuração do quiz (HTML)
router.get("/configuracao-quiz.html", quizController.getConfigPage);

// 3. Parâmetros JSON (exemplo)
router.get("/json-params-quiz", quizController.getJsonParamsQuiz);

// 4. Deploy do quiz (POST)
router.post("/deploy-quiz", quizController.deployQuiz);

// 5. Página do quiz (recebe id do aluno)
router.get("/quiz12345", quizController.getQuiz);

// 6. Envio de respostas
router.post("/submit-quiz", quizController.submitQuiz);

// 7. Página de analytics
router.get("/analytics", quizController.getAnalytics);

// 8. Dados de analytics (JSON)
router.get("/get-analytics", quizController.getAnalyticsData);

module.exports = router;

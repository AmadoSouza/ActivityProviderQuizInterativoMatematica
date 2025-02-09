// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// Rotas
router.get("/", quizController.getHome);
router.get("/configuracao-quiz.html", quizController.getConfigPage);
router.get("/json-params-quiz", quizController.getJsonParamsQuiz);
router.post("/deploy-quiz", quizController.deployQuiz);
router.get("/quiz", quizController.getQuiz);
router.post("/submit-quiz", quizController.submitQuiz);
router.get("/analytics", quizController.getAnalytics);
router.get("/get-analytics", quizController.getAnalyticsData);

module.exports = router;

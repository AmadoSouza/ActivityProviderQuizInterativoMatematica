const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');

app.use(bodyParser.json());

// Rota para a raiz ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'configuracao-quiz.html'));
});

app.post('/deploy-quiz', (req, res) => {
  console.log('Recebendo dados do formulário:', req.body);

  const { nivel_dificuldade, topicos, alunos, perguntas } = req.body;

  if (!nivel_dificuldade || !topicos || !alunos || alunos.length === 0 || !perguntas || perguntas.length === 0) {
    console.error('Dados incompletos recebidos');
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  const quizURLs = alunos.map(aluno => {
    const alunoID = uuid.v4();
    return `https://${req.hostname}/quiz12345?aluno=${alunoID}`;
  });

  // Aqui você pode salvar os dados no banco de dados, se necessário

  res.json({
    message: 'Quiz configurado com sucesso!',
    quizURLs: quizURLs
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

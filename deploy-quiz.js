const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(bodyParser.json());

app.post('/deploy-quiz', (req, res) => {
  const { nivel_dificuldade, topicos } = req.body;

  // Simulação de geração de URL única para cada aluno
  const alunoID = uuid.v4();
  const quizURL = `http://<domínio>/quiz12345?aluno=${alunoID}`;

  // Aqui você pode salvar os dados no banco de dados, se necessário

  res.json({
    message: 'Quiz configurado com sucesso!',
    quizURL: quizURL
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

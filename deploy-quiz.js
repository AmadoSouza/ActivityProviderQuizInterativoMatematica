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

  const { nivel_dificuldade, topicos } = req.body;

  if (!nivel_dificuldade || !topicos) {
    console.error('Dados incompletos recebidos');
    return res.status(400).json({ message: 'Dados incompletos' });
  }

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

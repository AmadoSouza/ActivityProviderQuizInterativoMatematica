const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');

app.use(bodyParser.json());

let quizzes = {}; // Armazenar quizzes configurados

// Rota para a raiz ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'configuracao-quiz.html'));
});

// Rota para o quiz
app.get('/quiz12345', (req, res) => {
  const alunoID = req.query.aluno;
  const quizData = quizzes[alunoID];

  if (!quizData) {
    return res.status(404).send('Quiz não encontrado');
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quiz de Matemática</title>
    </head>
    <body>
      <h1>Quiz de Matemática</h1>
      <div id="quiz-container"></div>

      <script>
        const perguntas = ${JSON.stringify(quizData.perguntas)};

        const quizContainer = document.getElementById('quiz-container');

        perguntas.forEach((pergunta, index) => {
          const perguntaDiv = document.createElement('div');
          perguntaDiv.innerHTML = \`<h3>\${index + 1}. \${pergunta.pergunta}</h3>\`;
          
          pergunta.opcoes.forEach(opcao => {
            const opcaoLabel = document.createElement('label');
            opcaoLabel.innerHTML = \`<input type="radio" name="pergunta\${index}" value="\${opcao}"> \${opcao}<br>\`;
            perguntaDiv.appendChild(opcaoLabel);
          });

          quizContainer.appendChild(perguntaDiv);
        });
      </script>
    </body>
    </html>
  `);
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
    quizzes[alunoID] = { perguntas };
    return `https://${req.hostname}/quiz12345?aluno=${alunoID}`;
  });

  res.json({
    message: 'Quiz configurado com sucesso!',
    quizURLs: quizURLs
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

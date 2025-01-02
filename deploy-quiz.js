const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const path = require('path');

app.use(bodyParser.json());

let quizzes = {}; // Armazenar quizzes configurados
let respostas = {}; // Armazenar respostas dos alunos

// Rota para a raiz ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'configuracao-quiz.html'));
});

// Rota para a página de configuração
app.get('/configuracao-quiz.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'configuracao-quiz.html'));
});

// Rota para fornecer os parâmetros JSON
app.get('/json-params-quiz', (req, res) => {
  res.json([
    { "name": "nivel_dificuldade", "type": "text/plain" },
    { "name": "topicos", "type": "text/plain" },
    { "name": "alunos", "type": "text/plain" },
    { "name": "perguntas", "type": "application/json" }
  ]);
});

// Rota para o quiz
app.get('/quiz12345', (req, res) => {
  const alunoID = req.query.aluno;
  const quizData = quizzes[alunoID];

  if (!quizData) {
    return res.status(404).send('Quiz não encontrado');
  }

  console.log('Perguntas carregadas para o aluno:', quizData.perguntas);

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quiz de Matemática</title>
    </head>
    <body>
      <h1>Quiz de Matemática</h1>
      <div id="quiz-container"></div>
      <button id="submit-quiz">Enviar Respostas</button>

      <script>
        const perguntas = ${JSON.stringify(quizData.perguntas)};
        const alunoID = "${alunoID}";

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

        document.getElementById('submit-quiz').addEventListener('click', () => {
          const respostas = perguntas.map((pergunta, index) => {
            const resposta = document.querySelector(\`input[name="pergunta\${index}"]:checked\`);
            return resposta ? resposta.value : null;
          });

          fetch('/submit-quiz', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ alunoID, respostas })
          })
          .then(response => response.json())
          .then(data => {
            alert('Respostas enviadas com sucesso!');
          })
          .catch(error => {
            console.error('Erro ao enviar respostas:', error);
          });
        });
      </script>
    </body>
    </html>
  `);
});

// Rota para receber as respostas dos alunos
app.post('/submit-quiz', (req, res) => {
  const { alunoID, respostas: respostasAluno } = req.body;

  if (!alunoID || !respostasAluno) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  respostas[alunoID] = respostasAluno;
  console.log('Respostas recebidas:', respostasAluno);

  res.json({ message: 'Respostas recebidas com sucesso!' });
});

// Rota para obter os dados analíticos
app.get('/analytics', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Desempenho dos Alunos</title>
    </head>
    <body>
      <h1>Desempenho dos Alunos</h1>
      <div id="analytics-container"></div>

      <script>
        fetch('/get-analytics')
          .then(response => response.json())
          .then(data => {
            const analyticsContainer = document.getElementById('analytics-container');
            Object.keys(data).forEach(alunoID => {
              const alunoDiv = document.createElement('div');
              alunoDiv.innerHTML = \`<h3>Aluno: \${alunoID}</h3>\`;
              data[alunoID].forEach((resposta, index) => {
                alunoDiv.innerHTML += \`<p>Pergunta \${index + 1}: \${resposta}</p>\`;
              });
              analyticsContainer.appendChild(alunoDiv);
            });
          })
          .catch(error => {
            console.error('Erro ao obter dados analíticos:', error);
          });
      </script>
    </body>
    </html>
  `);
});

// Rota para fornecer os dados analíticos
app.get('/get-analytics', (req, res) => {
  res.json(respostas);
});

app.post('/deploy-quiz', (req, res) => {
  console.log('Recebendo dados do formulário:', req.body);

  const { nivel_dificuldade, topicos, alunos, perguntas } = req.body;

  if (!nivel_dificuldade || !topicos || !alunos || alunos.length === 0 || !perguntas || perguntas.length === 0) {
    console.error('Dados incompletos recebidos');
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  console.log('Perguntas recebidas:', perguntas);

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

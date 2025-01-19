// /controllers/quizController.js
const path = require("path");
const uuid = require("uuid");
const analyticsObserver = require("../observers/analyticsObserver");

// Importa o model
const { quizzes, respostas } = require("../models/quizModel");

// ====== Ações do Controller ======

// 1. Exibe a página inicial (configuração do quiz)
exports.getHome = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "configuracao-quiz.html"));
};

// 2. Exibe a página de configuração (caso queira uma rota específica)
exports.getConfigPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "configuracao-quiz.html"));
};

// 3. Rota para fornecer os parâmetros JSON
exports.getJsonParamsQuiz = (req, res) => {
  // Exemplo fixo ou poderia ler de um arquivo
  res.json([
    { name: "nivel_dificuldade", type: "text/plain" },
    { name: "topicos", type: "text/plain" },
    { name: "alunos", type: "text/plain" },
    { name: "perguntas", type: "application/json" },
  ]);
};

// 4. Faz o deploy do quiz (salva config e gera links)
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
    //return `http://${req.hostname}:3000/quiz12345?aluno=${alunoID}`; //dev
    // return `http://${req.hostname}:3000/quiz12345?aluno=${alunoID}`;
    return http://${req.hostname}/quiz12345?aluno=${alunoID};
  });

  res.json({
    message: "Quiz configurado com sucesso!",
    quizURLs: quizURLs,
  });
};

// 5. Exibe o quiz para o aluno (GET /quiz12345?aluno=...)
exports.getQuiz = (req, res) => {
  const alunoID = req.query.aluno;
  const quizData = quizzes[alunoID];

  if (!quizData) {
    return res.status(404).send("Quiz não encontrado");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Quiz de Matemática</title>
      <!-- Bootstrap CSS -->
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      >
    </head>
    <body class="bg-light">
      <div class="container my-5">
        <h1 class="mb-4 text-center">Quiz de Matemática</h1>
        <div id="quiz-container" class="row"></div>
        <div class="text-center mt-4">
          <button id="submit-quiz" class="btn btn-primary">Enviar Respostas</button>
        </div>
      </div>

      <!-- Bootstrap JS (opcional, mas recomendado para componentes interativos) -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

      <script>
        const perguntas = ${JSON.stringify(quizData.perguntas)};
        const alunoID = "${alunoID}";

        const quizContainer = document.getElementById('quiz-container');

        perguntas.forEach((pergunta, index) => {
          // Card para cada pergunta
          const card = document.createElement('div');
          card.className = 'card mb-3';

          const cardBody = document.createElement('div');
          cardBody.className = 'card-body';

          // Título da pergunta
          const questionTitle = document.createElement('h5');
          questionTitle.className = 'card-title';
          questionTitle.textContent = \`\${index + 1}. \${pergunta.pergunta}\`;

          // Opções de resposta
          const optionsContainer = document.createElement('div');
          pergunta.opcoes.forEach(opcao => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'form-check';

            const optionInput = document.createElement('input');
            optionInput.className = 'form-check-input';
            optionInput.type = 'radio';
            optionInput.name = \`pergunta\${index}\`;
            optionInput.value = opcao;

            const optionLabel = document.createElement('label');
            optionLabel.className = 'form-check-label';
            optionLabel.textContent = opcao;

            optionDiv.appendChild(optionInput);
            optionDiv.appendChild(optionLabel);
            optionsContainer.appendChild(optionDiv);
          });

          cardBody.appendChild(questionTitle);
          cardBody.appendChild(optionsContainer);
          card.appendChild(cardBody);
          quizContainer.appendChild(card);
        });

        // Ação do botão "Enviar Respostas"
        document.getElementById('submit-quiz').addEventListener('click', () => {
          const respostas = perguntas.map((pergunta, index) => {
            const respostaMarcada = document.querySelector(\`input[name="pergunta\${index}"]:checked\`);
            return respostaMarcada ? respostaMarcada.value : null;
          });

          fetch('/submit-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alunoID, respostas })
          })
          .then(response => response.json())
          .then(data => {
            alert('Respostas enviadas com sucesso!');
          })
          .catch(error => {
            console.error('Erro ao enviar respostas:', error);
            alert('Ocorreu um erro ao enviar as respostas.');
          });
        });
      </script>
    </body>
    </html>
  `);
};

// 6. Recebe as respostas dos alunos
exports.submitQuiz = (req, res) => {
  const { alunoID, respostas: respostasAluno } = req.body;

  if (!alunoID || !respostasAluno) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  respostas[alunoID] = respostasAluno;

  const perguntasDoAluno = quizzes[alunoID]?.perguntas || [];

  analyticsObserver.emit("novaResposta", {
    // OBSERVER IMPLEMENTADO
    alunoID,
    respostasAluno,
    perguntas: perguntasDoAluno,
  });

  console.log("Respostas recebidas:", respostasAluno);

  res.json({ message: "Respostas recebidas com sucesso!" });
};

// 7. Exibe a página de analytics
exports.getAnalytics = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Desempenho dos Alunos</title>
      <!-- Bootstrap CSS -->
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      >
    </head>
    <body class="bg-light">
      <div class="container my-5">
        <h1 class="mb-4 text-center">Desempenho dos Alunos</h1>
        <div id="analytics-container" class="row"></div>
      </div>

      <!-- Bootstrap JS (opcional, mas recomendado para componentes interativos) -->
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

      <script>
        fetch('/get-analytics')
          .then(response => response.json())
          .then(data => {
            const analyticsContainer = document.getElementById('analytics-container');

            Object.keys(data).forEach(alunoID => {
              // Cria um card para cada aluno
              const cardDiv = document.createElement('div');
              cardDiv.className = 'card mb-3';

              const cardBody = document.createElement('div');
              cardBody.className = 'card-body';

              // Título com o ID do aluno
              const alunoTitle = document.createElement('h5');
              alunoTitle.className = 'card-title';
              alunoTitle.textContent = 'Aluno: ' + alunoID;
              cardBody.appendChild(alunoTitle);

              // Lista de respostas
              data[alunoID].forEach((resposta, index) => {
                const answerP = document.createElement('p');
                answerP.className = 'card-text';
                answerP.textContent = 'Pergunta ' + (index + 1) + ': ' + resposta;
                cardBody.appendChild(answerP);
              });

              // Monta e adiciona ao container
              cardDiv.appendChild(cardBody);
              analyticsContainer.appendChild(cardDiv);
            });
          })
          .catch(error => {
            console.error('Erro ao obter dados analíticos:', error);
          });
      </script>
    </body>
    </html>
  `);
};

// 8. Fornece os dados analíticos em formato JSON
exports.getAnalyticsData = (req, res) => {
  res.json(respostas);
};

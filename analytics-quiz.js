const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/analytics-quiz', (req, res) => {
  // Simulação de dados analíticos
  const analyticsData = {
    inveniraStdID: "aluno123",
    quantAnalytics: [
      {"name": "acertos", "type": "integer", "value": 8},
      {"name": "erros", "type": "integer", "value": 2}
    ],
    qualAnalytics: [
      {"name": "tempo_resposta", "type": "text/plain", "value": "5 minutos"}
    ]
  };

  res.json(analyticsData);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor de analytics rodando na porta ${PORT}`);
});

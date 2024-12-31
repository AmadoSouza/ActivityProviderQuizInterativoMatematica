const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/lista-analytics-quiz', (req, res) => {
  // Simulação de lista de analytics
  const analyticsList = [
    {"name": "acertos", "type": "integer"},
    {"name": "erros", "type": "integer"},
    {"name": "tempo_resposta", "type": "text/plain"}
  ];

  res.json(analyticsList);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor de lista de analytics rodando na porta ${PORT}`);
});

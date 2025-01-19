const EventEmitter = require("events");

class AnalyticsObserver extends EventEmitter {
  constructor() {
    super();
  }
}

// Exporta instância única para ser usada em todo o app
const analyticsObserver = new AnalyticsObserver();

analyticsObserver.on("novaResposta", (payload) => {
  const { alunoID, respostasAluno, perguntas } = payload;
  let acertos = 0;
  perguntas.forEach((p, index) => {
    if (respostasAluno[index] === p.resposta) {
      acertos++;
    }
  });

  console.log(`[Observer] Aluno ${alunoID} teve ${acertos} acertos.`);
});

module.exports = analyticsObserver;

export const MATURITY_DATE = "2027-03-12T00:00:00.000Z";
export function conversationPhase(now = Date.now()) {
  const starts = Date.parse(MATURITY_DATE);
  return {active: Number(now) >= starts, startsAt: MATURITY_DATE, mode: Number(now) >= starts ? "conversational-initiative" : "scheduled-after-gestation", nature: "Autonomia conversazionale simulata; nessuna affermazione di coscienza soggettiva", scope: "Domande e riflessioni nel sito, senza azioni esterne"};
}
export function nextProjectQuestion(bank, answers = [], current = null) {
  const answered = new Set(answers.map(answer=>answer.questionKey));
  if (current && current.key !== "attesa" && !answered.has(current.key)) return current;
  return bank.find(question=>!answered.has(question.key)) || bank.at(-1) || null;
}

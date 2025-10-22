exports.score = async (answers = []) => {
  // naive scoring
  const total = answers.length;
  const correct = answers.filter(a => a.correct).length;
  return { total, correct, percentage: total ? Math.round((correct / total) * 100) : 0 };
};

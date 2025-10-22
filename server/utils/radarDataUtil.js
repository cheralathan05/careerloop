exports.toRadar = (scoreMap = {}) => {
  return Object.entries(scoreMap).map(([k, v]) => ({ label: k, value: v }));
};

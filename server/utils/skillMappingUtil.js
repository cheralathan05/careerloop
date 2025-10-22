// minimal mapping util
exports.mapSkillsToDomains = (skills = []) => {
  // naive static mapping
  const domainBuckets = {
    'Web Development': ['react', 'node', 'html', 'css', 'javascript'],
    'Data Science': ['python', 'pandas', 'numpy', 'ml', 'statistics'],
    'UI/UX': ['figma', 'ux', 'ui', 'prototyping']
  };
  const scores = {};
  for (const [domain, domainSkills] of Object.entries(domainBuckets)) {
    scores[domain] = skills.filter(s => domainSkills.includes(s.toLowerCase())).length;
  }
  return scores;
};

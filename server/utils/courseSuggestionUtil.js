exports.suggestCourses = (domain) => {
  // static suggestions; replace with real AI later
  const map = {
    'Web Development': [{ title: 'React Fundamentals', provider: 'Coursera', url: '#' }],
    'Data Science': [{ title: 'Intro to Data Science', provider: 'edX', url: '#' }]
  };
  return map[domain] || [];
};

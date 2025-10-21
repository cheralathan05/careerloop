// src/services/onboardingService.js

const mockDomains = [
    { id: 'cloud_devops', name: 'Cloud & DevOps', skills: ['AWS/Azure', 'Terraform', 'Kubernetes'] },
    { id: 'cyber_security', name: 'Cyber Security', skills: ['Penetration Testing', 'Firewalls', 'Compliance'] },
    { id: 'web_dev', name: 'Web Development', skills: ['React', 'Node.js', 'APIs'] },
    { id: 'data_science', name: 'Data Science', skills: ['Python', 'ML', 'Big Data'] },
];

const onboardingService = {
    // Phase 7: AI recommends career domains
    getDomainRecommendations: async (primarySkills) => {
        console.log(`[Service] Fetching domains for skills: ${primarySkills.join(', ')}`);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Simple logic: If 'Python' is included, suggest Data Science. Otherwise, suggest others.
        if (primarySkills.includes('Python')) {
            return mockDomains.filter(d => d.id === 'data_science' || d.id === 'cloud_devops');
        }
        return mockDomains.slice(0, 3);
    },

    // Phase 9: AI generates initial suggestions
    getAIRecommendations: async (skillData) => {
        console.log(`[Service] Generating AI recommendations based on scores: ${skillData.scores}`);
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate AI processing time

        return {
            tasks: [
                `Review fundamental concepts in ${skillData.gaps[0] || 'Core Concepts'} today.`,
                "Schedule a 30-minute chat with your AI Mentor.",
                "Complete the introductory module on AWS Basics."
            ],
            mentors: [
                { id: 101, name: "Mentor A. Smith", domain: "Web Dev", rating: 4.8 },
                { id: 102, name: "Mentor B. Jones", domain: "Data Sci", rating: 4.5 }
            ],
            courses: [
                { id: 201, name: "Advanced State Management", provider: "SkillShare" },
                { id: 202, name: "Intro to Python for Data", provider: "Coursera" }
            ],
        };
    }
};

export default onboardingService;
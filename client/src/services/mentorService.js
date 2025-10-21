// src/services/mentorService.js

const mockMentors = [
    { id: 1, name: "Dr. Evelyn Reed", domain: "Data Science", rating: 4.9 },
    { id: 2, name: "Mark A. Johnson", domain: "Web Development", rating: 4.7 },
];

const mentorService = {
    // Phase 10: Fetch top mentors based on user skill gaps
    getMentorsBySkills: async (skillGaps) => {
        console.log(`[Mentor Service] Fetching mentors for gaps: ${skillGaps.join(', ')}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock filtering logic
        return mockMentors.filter(m => m.domain.toLowerCase().includes(skillGaps[0]?.split(' ')[0].toLowerCase() || 'web'));
    },

    // Phase 32: Match a single best mentor
    matchBestMentor: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 700));
        return mockMentors[0];
    }
};

export default mentorService;
// Initial state for the context provider
export const initialOnboardingState = {
    currentPhase: 1, // Starts at the Welcome screen
    isComplete: false,
    details: { 
        fullName: '', 
        education: '', 
        interests: [], 
        skills: [],
        resumeUrl: null, // Cloudinary URL 
    },
    domains: [],      // AI recommended/user selected domains: [{name, score}]
    quiz: [],         // AI generated questions
    answers: [],      // User's raw quiz answers
    summary: null,    // Final AI analysis (radar, tasks, courses)
    skillScores: {},  // Scores used for radar chart
};

// Map of the entire flow (Used for progress bar and conditional rendering)
export const ONBOARDING_FLOW_MAP = [
    { phase: 1, name: "Welcome" },
    { phase: 2, name: "User Details" },
    { phase: 3, name: "Domain Selection" },
    { phase: 4, name: "Skill Assessment" },
    { phase: 5, name: "Summary Report" },
    { phase: 6, name: "AI Assistant Chat" },
    { phase: 7, name: "Finish" },
];

export const MAX_DOMAINS_SELECT = 5;
export const MAX_SKILLS_INPUT = 15;
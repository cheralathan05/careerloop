// src/services/aiService.js

/**
 * Mock Service for interacting with the core AI engine (e.g., Gemini, OpenAI, custom backend).
 */
const aiService = {
    // Phase 10: Generates a response based on chat history and user profile
    getAIChatResponse: async (messages, userData) => {
        console.log(`[AI Service] Generating chat response for user: ${userData.fullName}`);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500)); // Simulate AI latency

        const lastMessage = messages[messages.length - 1];
        let responseText = `That's a great question, ${userData.fullName}.`;
        
        if (lastMessage && lastMessage.text.toLowerCase().includes('task')) {
            responseText = `Based on your **${userData.selectedDomains[0] || 'Web Dev'}** domain selection, your priority task is to **"Master asynchronous JavaScript."** I've added this to your Planner.`;
        } else if (lastMessage && lastMessage.text.toLowerCase().includes('mentor')) {
            responseText = `I recommend connecting with **Mentor A. Smith** (Web Dev, 4.8 Rating). You can find them in the Community section.`;
        } else {
            responseText = "I can help you prioritize tasks, find a mentor, or suggest a course. Try asking me for your next step!";
        }

        return {
            text: responseText,
            timestamp: new Date().toISOString()
        };
    },

    // Phase 7: Used internally by onboardingService for initial domain recommendation
    analyzeSkillsForDomains: async (skills) => {
        console.log(`[AI Service] Analyzing skills for domain mapping...`);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        // Mock returning confidence scores
        return {
            web_dev: 0.85,
            data_science: 0.60,
            ux_ui: 0.75
        };
    }
};

export default aiService;
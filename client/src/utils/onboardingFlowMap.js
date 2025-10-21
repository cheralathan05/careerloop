// src/utils/onboardingFlowMap.js

// Maps the current phase number to the next phase number and the corresponding component/page
export const onboardingFlowMap = {
    5: { name: 'Welcome Screen', next: 6, component: 'Welcome' },
    6: { name: 'User Details Form', next: 7, component: 'UserDetailsForm' },
    7: { name: 'Domain Selection', next: 8, component: 'DomainSelection' },
    8: { name: 'Skill Assessment', next: 9, component: 'SkillAssessment' },
    9: { name: 'Onboarding Summary', next: 10, component: 'OnboardingSummary' },
    10: { name: 'AI Onboarding Assistant', next: 11, component: 'AIOnboardingAssistant' },
    11: { name: 'Dashboard Home', next: null, component: 'DashboardHome' }, // End of Onboarding flow
};

// Map component names to actual imported components (for dynamic routing)
export const getOnboardingComponent = (phase) => {
    switch (phase) {
        case 5:
            return 'Welcome';
        case 6:
            return 'UserDetailsForm';
        case 7:
            return 'DomainSelection';
        case 8:
            return 'SkillAssessment';
        case 9:
            return 'OnboardingSummary';
        case 10:
            return 'AIOnboardingAssistant';
        default:
            return 'Welcome'; // Fallback
    }
};
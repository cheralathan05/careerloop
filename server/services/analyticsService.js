// server/services/analyticsService.js (FINAL, PROVIDER-AGNOSTIC)
import analyticsConfig from '../config/analyticsConfig.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js'; // The Mongoose model

// ======================================================
// 1. INTERNAL (Database) Tracking Function
// ======================================================
/**
 * Logs the event directly to the MongoDB AnalyticsEvent collection.
 */
const internalTrack = async (user, eventType, payload = {}) => {
    try {
        // NOTE: The 'user' field can be null for unauthenticated events.
        const event = await AnalyticsEvent.create({ 
            user: user, 
            eventType: eventType, 
            payload: payload 
        });
        return event;
    } catch (error) {
        console.error("❌ Internal analytics logging failed:", error.message);
        // Do not throw, as analytics failure shouldn't crash the main request
        return null;
    }
};

// ======================================================
// 2. EXTERNAL (Mixpanel/Google) Tracking Stubs
// ======================================================
/**
 * Placeholder for external API tracking.
 */
const externalTrack = (providerName) => async (user, eventType, payload = {}) => {
    // In a real implementation, you would initialize the Mixpanel/GA SDK
    // with analyticsConfig.API_KEY and call its track method here.
    
    // We use a non-blocking console log for simplicity.
    console.log(`[EXTERNAL ANALYTICS: ${providerName}] Event: ${eventType} (User: ${user || 'Guest'})`);
    return true;
};

// ======================================================
// 3. PROVIDER MAPPING
// ======================================================
const providers = {
    // Maps to the internal database tracking function
    internal: internalTrack, 
    // Maps to stubs for external services
    mixpanel: externalTrack('Mixpanel'),
    google: externalTrack('Google Analytics'),
};

// ======================================================
// 4. CENTRAL TRACKING INTERFACE
// ======================================================
let analyticsTracker = {
    // Default NOOP function if analytics are disabled or provider is invalid
    log: () => { /* no operation */ }
};

if (analyticsConfig.ENABLED) {
    const providerKey = analyticsConfig.PROVIDER.toLowerCase();
    
    // Select the correct provider function, falling back to internal if invalid
    const selectedProvider = providers[providerKey] || internalTrack;
    
    // Set the central interface to the selected provider's function
    analyticsTracker.log = selectedProvider;
    console.log(`✅ Analytics initialized. Provider: ${providerKey}.`);
} else {
    console.log("Analytics are disabled per configuration.");
}

// Export the 'log' function (which is aliased to 'track' in the controllers)
export const log = analyticsTracker.log;
// Export the entire object for consistency if needed
export default analyticsTracker;
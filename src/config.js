// Configuration file for environment variables
const config = {
  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.safepay.kg',
  API_DOMAIN: process.env.API_DOMAIN || 'api.safepay.kg',
  
  // Application Branding
  APP_NAME: process.env.APP_NAME || 'SafePay',
  APP_DISPLAY_NAME: process.env.APP_DISPLAY_NAME || 'База платежей SafePay',
  APP_DOMAIN: process.env.APP_DOMAIN || 'safepay.kg',
  
  // Manager ID
  MANAGER_ID: process.env.MANAGER_ID || 'safepay_uZA-s8i',
  
  // Helper function to get full API URL
  getApiUrl: (endpoint) => {
    return `${config.API_BASE_URL}${endpoint}`;
  }
};

export default config; 
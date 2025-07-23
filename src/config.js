// Configuration file for environment variables
const config = {
  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.maxpay.kz',
  API_DOMAIN: process.env.API_DOMAIN || 'api.maxpay.kz',
  
  // Application Branding
  APP_NAME: process.env.APP_NAME || 'MaxPay',
  APP_DISPLAY_NAME: process.env.APP_DISPLAY_NAME || 'База платежей MaxPay',
  APP_DOMAIN: process.env.APP_DOMAIN || 'maxpay.kz',
  
  // Manager ID
  MANAGER_ID: process.env.MANAGER_ID || 'maxpay_uZA-s8i',
  
  // Helper function to get full API URL
  getApiUrl: (endpoint) => {
    return `${config.API_BASE_URL}${endpoint}`;
  }
};

export default config; 

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atharv.aifinance',
  appName: 'Welth',
  webDir: 'public',

  server: {
    url: 'https://ai-finance-platform-delta-silk.vercel.app',
    cleartext: true,
    allowNavigation: [
      'ai-finance-platform-delta-silk.vercel.app'
    ]
  }
};

export default config;
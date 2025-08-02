import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dbe06e65b0b54a72aaf2e747b8aff345',
  appName: 'Moto-Táxi Express',
  webDir: 'dist',
  server: {
    url: 'https://dbe06e65-b0b5-4a72-aaf2-e747b8aff345.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ff7f00',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;
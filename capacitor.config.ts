import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tallermunoz.app',
  appName: 'Taller Munoz',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
/**
 * Swapped in for environment.ts on production builds via the `fileReplacements`
 * entry in angular.json. Without that entry this file is never used at all.
 *
 * The Firebase web config is intentionally public — it identifies the project
 * and is restricted by authorised domains in the Firebase console, not by secrecy.
 */
export const environment = {
  production: true,
  // Render service defined in gym-backend/render.yaml (name: ironfit-api).
  // If Render assigns a different hostname, update this and redeploy.
  apiUrl: 'https://ironfit-api.onrender.com/api',
  firebase: {
    apiKey: 'AIzaSyDe-qHdMaxG4gTkDEZaR67ObpOjUf-POpc',
    authDomain: 'gymapp-5705d.firebaseapp.com',
    projectId: 'gymapp-5705d',
    storageBucket: 'gymapp-5705d.firebasestorage.app',
    messagingSenderId: '950546063983',
    appId: '1:950546063983:web:8c48b75e54a19d6eaca39a',
    measurementId: 'G-YHE092TTP5',
  },
};

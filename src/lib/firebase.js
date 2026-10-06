// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// (Optional) analytics only if supported
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBdNfTHTBoOiwyYO7vXGASixsi5tKroosU",
  authDomain: "goal-finder-5636c.firebaseapp.com",
  projectId: "goal-finder-5636c",
  storageBucket: "goal-finder-5636c.firebasestorage.app",
  messagingSenderId: "860099586083",
  appId: "1:860099586083:web:9c9bcd3090952d35046996",
  measurementId: "G-J5CKRL5LHB",
};

// Initialize once (avoids duplicate-init issues on HMR)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Auth bound to THIS app
export const auth = getAuth(app);

// Optional analytics (don’t crash if not supported)
analyticsSupported().then((ok) => {
  if (ok) getAnalytics(app);
});

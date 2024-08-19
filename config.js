import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCFoNfrCJxH3LadqhT8nK90lCNx6yxvc8g",
  authDomain: "smit-hosting.firebaseapp.com",
  projectId: "smit-hosting",
  storageBucket: "smit-hosting.appspot.com",
  messagingSenderId: "1061837502211",
  appId: "1:1061837502211:web:174882e8cdb70f726cdb36",
  measurementId: "G-KY3YW11BTQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
{/* const analytics = getAnalytics(app); */ }



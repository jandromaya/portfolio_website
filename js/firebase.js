// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBT5ic3YyK77bil5tqva1V4AWdzOYzisJ8",
    authDomain: "lights-and-alarm.firebaseapp.com",
    databaseURL: "https://lights-and-alarm-default-rtdb.firebaseio.com",
    projectId: "lights-and-alarm",
    storageBucket: "lights-and-alarm.firebasestorage.app",
    messagingSenderId: "279971334274",
    appId: "1:279971334274:web:fd484c8cf2e88e55e38c9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// Initializing UI elements I want to interact with
const readyBtn = document.getElementById('ready-btn')
const resultTxt = document.getElementById('result-txt');
const input = document.getElementById('input');
const checkbox = document.getElementById('enable');

// Setting the "enabled" property
function setEnabled() {
  set(ref(database, 'alarm/enabled'), checkbox.checked);
  set(ref(database, 'alarm/last_updated'), Date.now());
}

// Setting the hours and minutes of the alarm
function setDatabase() {
  const time = input.value;
  const [hour, min] = time.split(":");


  set(ref(database, 'alarm/hour'), parseInt(hour));
  set(ref(database, 'alarm/minute'), parseInt(min));
  set(ref(database, 'alarm/last_updated'), Date.now());

  resultTxt.textContent = "Alarm now set to " + hour + ":" + min;
}

async function readDatabase() {
  try {
    // Getting alarm time and storing it in hour & min
    const snapshot = await get(ref(database, 'alarm'));

    // If an alarm time is currently set, displaying it on the page
    if (snapshot.exists()) {
      const hour = snapshot.val().hour;
      const min = snapshot.val().minute;
      checkbox.checked = snapshot.val().enabled;
        resultTxt.textContent = "Alarm time set to " + hour + ":" + min;
    } else {
      resultTxt.textContent = "No data available";
    }
  } catch (error) {
    // If there are any errors, displaying that on page
    console.error(error);
    resultTxt.textContent = "Error reading data. " + error;
  }
}

async function loginAdmin() {
  const email = "alejandro.mayagoitia614@gmail.com";
  const password = prompt("Enter password");

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    readDatabase();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    resultTxt.textContent = "Login failed: " + errorCode + errorMessage;
  });
}

readyBtn.addEventListener('click', setDatabase);
checkbox.addEventListener('change', setEnabled);
//window.addEventListener('load', readDatabase);
window.addEventListener('load', loginAdmin);

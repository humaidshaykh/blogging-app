import { createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { auth } from "./config.js";

const form = document.querySelector("#form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

form.addEventListener('submit', (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user);
            email.value = '';
            password.value = '';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        window.location = "home.html";
    } else {
        // User is signed out
    }
});

let logout_condition = document.querySelector("#logout_condition");

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;

        logout_condition.innerHTML = `<a class="nav-link" href="#" id="logout_btn">Logout</a>`;

        console.log(uid);

        const logout_btn = document.querySelector("#logout_btn");
        logout_btn.addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log('Logout Successfully');
                // window.location = "home.html";
            }).catch((error) => {
                logout_condition.innerHTML = `<a class="nav-link" href="login.html">Login/Register</a>`;
                alert(error);
            });
        });

    } else {
        logout_condition.innerHTML = `<a class="nav-link" href="login.html">Login/Register</a>`;
    }
});
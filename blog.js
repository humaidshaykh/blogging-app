import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, getDocs, query } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { auth, app } from "./config.js";

const db = getFirestore(app);

const displayAllBlogs = async () => {
    const showAllBlogsContainer = document.querySelector("#show_all_blogs");
    showAllBlogsContainer.innerHTML = '';

    try {
        const q = query(collection(db, "blogs"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const blogData = doc.data();
            const blogId = doc.id;

            const blogCard = `
                <div class="card w-100 mt-2">
                    <div class="card-body">
                        <h5 class="card-title">${blogData.title}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${blogData.date}</h6>
                        <p class="card-text">${blogData.content}</p>
                        <a href="#" class="card-link text-success" data-user-id="${blogData.user_id}" onclick="seeAllFromThisUser(event)">see all from this user</a>
                    </div>
                </div>
            `;
            showAllBlogsContainer.innerHTML += blogCard;
        });
    } catch (error) {
        console.error("Error fetching blogs: ", error);
    }
};


window.seeAllFromThisUser = (event) => {
    event.preventDefault();
    const userId = event.target.getAttribute('data-user-id');
    window.location.href = `publisher_profile.html?user_id=${userId}`;
};

displayAllBlogs();




let logout_condition = document.querySelector("#logout_condition");

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        logout_condition.innerHTML = `<a class="nav-link" href="#" id="logout_btn">Logout</a>`;

        console.log(currentUserId);

        const logout_btn = document.querySelector("#logout_btn");
        logout_btn.addEventListener('click', () => {
            signOut(auth).then(() => {
                // Sign-out successful.
                console.log('Logout Successfully');
                // window.location = "home.html";
            }).catch((error) => {
                logout_condition.innerHTML = `<a class="nav-link" href="login.html">Login/Register</a>`;
                alert(error);
            });
        });

    } else {
        logout_condition.innerHTML = `<a class="nav-link" href="login.html">Login/Register</a>`;
        // window.location = "blog.html";
    }
});
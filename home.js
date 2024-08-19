import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { app, auth } from "./config.js"; // Import existing Firebase app and auth

const db = getFirestore(app);

let currentUserId = null;

let logout_condition = document.querySelector("#logout_condition");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUserId = user.uid;
        logout_condition.innerHTML = `<a class="nav-link" href="#" id="logout_btn">Logout</a>`;

        console.log(currentUserId);

        const logout_btn = document.querySelector("#logout_btn");
        logout_btn.addEventListener('click', () => {
            signOut(auth).then(() => {
                // Sign-out successful.
                console.log('Logout Successfully');
                window.location = "login.html";
            }).catch((error) => {
                logout_condition.innerHTML = `<a class="nav-link" href="login.html">Login/Register</a>`;
                alert(error);
            });
        });

    } else {
        logout_condition.innerHTML = `<a class="nav-link" href="login.html">Login/Register</a>`;
        window.location = "blog.html";
    }
});

// handle publishing blog
const publishBlog = async () => {
    const blogTitle = document.querySelector("#blog_title").value.trim();
    const blogContent = document.querySelector("#blog_content").value.trim();

    if (!blogTitle || !blogContent) {
        alert("Please fill in both the title and content before publishing.");
        return;
    }

    const currentDate = new Date().toISOString();

    try {
        await addDoc(collection(db, "blogs"), {
            title: blogTitle,
            content: blogContent,
            date: currentDate,
            user_id: currentUserId
        });
        alert("Blog published successfully!");
        document.querySelector("#blog_title").value = "";
        document.querySelector("#blog_content").value = "";
        displayBlogs();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("An error occurred while publishing the blog. Please try again.");
    }
};

document.querySelector("#publish_blog").addEventListener("click", () => {
    if (currentUserId) {
        publishBlog();
    } else {
        alert("User not signed in.");
    }
});



// Retrieve Blog Data


const displayBlogs = async () => {
    const blogsContainer = document.querySelector("#my_blogs");
    blogsContainer.innerHTML = ''; // Clear existing content

    try {
        const q = query(collection(db, "blogs"), where("user_id", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const blogData = doc.data();
            const blogId = doc.id;

            const blogCard = `
                <div class="card w-100 mt-2" id="${blogId}">
                    <div class="card-body">
                        <h5 class="card-title">${blogData.title}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${blogData.date}</h6>
                        <p class="card-text">${blogData.content}</p>
                        <a href="#" class="card-link text-success" onclick="editBlog('${blogId}')">Edit Blog</a>
                        <a href="#" class="card-link text-danger" onclick="deleteBlog('${blogId}')">Delete Blog</a>
                    </div>
                </div>
            `;
            blogsContainer.innerHTML += blogCard;
        });
    } catch (error) {
        console.error("Error fetching blogs: ", error);
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        displayBlogs();
    }
});








// Edit and delete blog function

window.editBlog = async (blogId) => {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");

    if (newTitle && newContent) {
        try {
            const blogRef = doc(db, "blogs", blogId);
            await updateDoc(blogRef, {
                title: newTitle,
                content: newContent
            });
            alert("Blog updated successfully!");
            displayBlogs();

            window.location.hash = `edit-${blogId}`;
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("An error occurred while updating the blog. Please try again.");
        }
    }
};

window.deleteBlog = async (blogId) => {
    if (confirm("Are you sure you want to delete this blog?")) {
        try {
            const blogRef = doc(db, "blogs", blogId);
            await deleteDoc(blogRef);
            alert("Blog deleted successfully!");
            displayBlogs();

            window.location.hash = `deleted-${blogId}`;
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("An error occurred while deleting the blog. Please try again.");
        }
    }
};

displayBlogs();
const firebaseConfig = {
  apiKey: "AIzaSyAft_RV4oxTLJrmKJ6URmPjILJW7pF3rhs",
  authDomain: "movietickectbooking.firebaseapp.com",
  databaseURL: "https://movietickectbooking-default-rtdb.firebaseio.com",
  projectId: "movietickectbooking",
  storageBucket: "movietickectbooking.firebasestorage.app",
  messagingSenderId: "626045559812",
  appId: "1:626045559812:web:6ede63b169ce098d98c151",
  measurementId: "G-SRKHT6MR4N"
};

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth=firebase.auth();
  const db=firebase.firestore();
 
// ---------------------------
// DOM Elements
// ---------------------------
document.addEventListener("DOMContentLoaded", function() {
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");
 
    // ---------------------------
    // Register User
    // ---------------------------
    registerBtn.addEventListener("click", function() {
        const userName = document.getElementById("user-name").value.trim();
        const email =    document.getElementById("user-email").value.trim();
        const password = document.getElementById("user-password").value.trim();
 
        if (!userName || !email || !password) {
            alert("⚠️ Please fill in all fields before registering.");
            return;
        }
 
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
 
                // Save user details in Firestore
                db.collection("users").doc(user.uid).set({
                    name: userName,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
 
                // Save info in localStorage
                localStorage.setItem("user_name", userName);
                localStorage.setItem("email", email);
 
                alert(`✅ Registration successful! Welcome ${userName}`);
                window.location.href = "event.html"; // Redirect after success
            })
            .catch(error => {
                alert(`❌ Registration failed: ${error.message}`);
            });
    });
 
    // ---------------------------
    // Login User
    // ---------------------------
    loginBtn.addEventListener("click", function() {
        const email = document.getElementById("user-email").value.trim();
        const password = document.getElementById("user-password").value.trim();
        const userName = document.getElementById("user-name").value.trim();
 
        if (!email || !password) {
            alert("⚠️ Please enter both email and password to login.");
            return;
        }
 
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Save info in localStorage
                localStorage.setItem("user_name", userName || "User");
                localStorage.setItem("email", email);
 
                alert(`🎉 Login successful! Welcome back ${email}`);
                window.location.href = "event.html"; // Redirect after login
            })
            .catch(error => {
                alert(`❌ Login failed: ${error.message}`);
            });
    });
});
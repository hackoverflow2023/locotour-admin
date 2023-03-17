const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      firebase.auth().onAuthStateChanged((user) => {
        localStorage.setItem("user", JSON.stringify(user));
      });
      window.location.href = "./admin.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage.message);
      console.log(errorCode, errorMessage);
    });
});

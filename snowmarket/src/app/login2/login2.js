const logiFormToggler = document.querySelector(".loginform");
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

function showRegisterFrom() {
  if (loginForm.hidden) {
    registerForm.hidden = false;
    loginForm.hidden = true;
    button.innerHTML = "login";
  }
}

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

logiFormToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-loginForm")
);

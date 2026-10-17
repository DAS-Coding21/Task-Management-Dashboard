const signindBtnEl = document.getElementById("signindBtn");
const closeModalBtnEl = document.getElementById("closeLoginBtn");

// Show the modal card
signindBtnEl.addEventListener("click", () => {
  const loginModalEl = document.getElementById("loginModal");
  loginModalEl.classList.add("active");
});

// Close the modal card
closeModalBtnEl.addEventListener("click", () => {
  const loginModalEl = document.getElementById("loginModal");
  loginModalEl.classList.remove("active");
});


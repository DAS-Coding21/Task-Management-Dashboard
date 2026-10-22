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

// UserRegistration Form
const registrationFormEl = document.getElementById("registrationForm");

if (registrationFormEl) {
  registrationFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const formData = { username, name, email, password };

    try {
      const response = await fetch("http://localhost:3000/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const responseResult = await response.json();

      if(responseResult.success){
        console.log(responseResult.message);
        alert('User resgister successfully');
      }
      else{
        console.log(responseResult.message);
        alert(responseResult.message);
      }

    } catch (error) {
      alert("An error occurred: " + error.message);
      console.error("Error registering user:", error);
    }
  });
}
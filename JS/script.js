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

    const signUpUsername = document.getElementById("signUpUsername").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const formData = { signUpUsername, name, email, password };
    console.log(formData);

    try {
      const response = await fetch("http://localhost:3000/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const responseResult = await response.json();

      if (responseResult.success) {
        console.log(responseResult.message);
        alert('User resgister successfully');
      }
      else {
        console.log(responseResult.message);
        alert(responseResult.message);
      }

    } catch (error) {
      alert("An error occurred: " + error.message);
      console.error("Error registering user:", error);
    }
  });
}

// User Sign-in Form
const signInFormEl = document.getElementById('signInForm');

if (signInFormEl) {
  signInFormEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const signInUsernameVal = document.getElementById('signInUsername').value;
    const userPaswordVal = document.getElementById('userPasword').value;

    const formData = { signInUsernameVal, userPaswordVal };
    console.log(formData);

    try {
      const response = await fetch("http://localhost:3000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const responseResult = await response.json();
      console.log(responseResult);

      if(responseResult.success){
        console.log(responseResult.message);

        localStorage.setItem('userId', responseResult.user.id);
        localStorage.setItem('userName', responseResult.user.username);

        window.location.href = 'dashboard-section/dashboard.html';

        alert(responseResult.message);
      }
      else{
        console.log(responseResult.message);
        alert(responseResult.message);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
      console.error("Error registering user:", error);
    }
  })
}
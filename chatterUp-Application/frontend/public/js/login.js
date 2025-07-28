document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  const loginUsernameInput = document.getElementById("login-username");
  const loginPasswordInput = document.getElementById("login-password");

  const registerUsernameInput = document.getElementById("register-username");
  const registerPasswordInput = document.getElementById("register-password");
  const registerProfileInput = document.getElementById("register-profile-pic");

  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("d-none");
    registerForm.classList.remove("d-none");
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();
    //Read profile picture as base64

    if (!username || !password) {
      alert("Please enter correct credentials!");
      return;
    }

    console.log("Sending Login Request:", username, password);

    //read profile picture as base64

    try {
      const response = await fetch("http://localhost:3500/api/users/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        //save to local storage
        localStorage.setItem("username", result.user.username);
        localStorage.setItem("profilePic", result.user.profilePic);
        alert("Login Successfully!");
        window.location.href = "./chat.html";
      } else {
        alert(result.message || "Login Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = registerUsernameInput.value.trim();
    const password = registerPasswordInput.value.trim();
    const file = registerProfileInput.files[0];

    if (!username || !password || !file) {
      alert("Please fill all fields and upload a profile");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const profilePic = reader.result; //base64

      try {
        const res = await fetch("http://localhost:3500/api/users/register", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username, password, profilePic }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registration successful! Please Login");
          registerForm.reset();
          showLogin.click(); //switch back to login form
        } else {
          alert(data.message || "Registration Failed.");
        }
      } catch (err) {
        console.error("Registration error:", err);
        alert("Something went wrong");
      }
    };

    reader.readAsDataURL(file);
  });
});

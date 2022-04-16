const form = document.querySelector("form");
const btn = document.querySelector(".btn");

const signUp = document.querySelector(".signUp");

const alertBox = document.querySelector(".alert");
alertBox.style.display = "none";

form.onsubmit = async (event) => {
  event.preventDefault();

  if (!form.password.value && !form.email.value) {
    console.log(alertBox);
    alertBox.style.display = "block";
    alertBox.innerHTML = "Please Inter All fields";
    return;
  }

  alertBox.style.display = "none";

  const response = await fetch("https://streetsecurity.herokuapp.com/login", {
    method: "POST",
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();
  if (data.status) {
    alertBox.style.display = "block";
    alertBox.innerHTML = data.message;
  }
  if (data._id) {
    if (data.isAdmin) {
      localStorage.setItem("adminLogedIn", true);
      window.location.href = "/client/adminDashboard/index.html";
    } else {
      window.location.href = "/client/userDashboard/index.html?id=" + data._id;
      localStorage.setItem("adminLogedIn", false);
    }
  }
};

signUp.onclick = () => {
  window.location.href = "/client/signup/signup.html";
};

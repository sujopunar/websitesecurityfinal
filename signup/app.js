const form = document.querySelector("form");
const login = document.querySelector(".login");

const alertBox = document.querySelector(".alert");
alertBox.style.display = "none";

form.onsubmit = async (event) => {
  event.preventDefault();

  let image = false;
  //VALIDATION
  if (form.profile.files[0]) {
    // BASE 64 CONVERTION OF THE IMAGE.
    const file = form.profile.files[0];
    image = await base64(file);
  }

  if (
    !form.lastName.value &&
    !form.firstName.value &&
    !form.password.value &&
    !form.phone.value &&
    !form.email.value
  ) {
    console.log(alertBox);
    alertBox.style.display = "block";
    alertBox.innerHTML = "Please Inter All fields";
    return;
  }

  alertBox.style.display = "none";
  const response = await fetch("https://streetsecurity.herokuapp.com/signup", {
    method: "POST",
    body: JSON.stringify({
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      password: form.password.value,
      phone: form.phone.value,
      email: form.email.value,
      street: "California Street (SY-NC-BS)",
      profile: image ? image : "noImage",
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
    window.location.href = "/client/userDashboard/index.html?id=" + data._id;
  }

  console.log("clicked");
};

login.onclick = () => {
  window.location.href = "/client/login/login.html";
};

const base64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

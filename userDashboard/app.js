const form = document.querySelector("form");
const btn = document.querySelector(".logout");

//GETTING USER ID FROM PARAMS
address = window.location.search;
parameterList = new URLSearchParams(address);
const id = parameterList.get("id");

btn.onclick = () => {
  window.location.href = "/websitesecurityfinal/index.html";
};

const alerta = document.querySelector(".alert");

let userObject;
async function fetchLogedInUser() {
  const user = await fetch(`https://streetsecurity.herokuapp.com/user/${id}`);
  userObjectForFunction = await user.json();
  userObject = userObjectForFunction;
  const monthsBillNotPaid = window
    .moment()
    .diff(window.moment(userObjectForFunction[0].lastBillPaidDate), "months");

  alerta.querySelector(".month").innerHTML = monthsBillNotPaid;
  alerta.querySelector(".bill").innerHTML = "PKR " + monthsBillNotPaid * 3000;
}
fetchLogedInUser();

form.onsubmit = async (event) => {
  event.preventDefault();

  //VALIDATION
  if (!form.file.files[0]) {
    console.log("please select an image");
    return;
  }

  // BASE 64 CONVERTION OF THE IMAGE.
  const file = form.file.files[0];
  const image = await base64(file);

  //POSTING TO UPDATE LASTBILLDATE
  const response = await fetch(
    "https://streetsecurity.herokuapp.com/userbill",
    {
      method: "POST",
      body: JSON.stringify({
        userId: id,
        billImage: image,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  const data = await response.json();

  //RESPONSE TO USER
  console.log(data);
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

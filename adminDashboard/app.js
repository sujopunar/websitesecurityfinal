// THIS WILL HADNLE LOGOUT
const btn = document.querySelector(".logout");

btn.onclick = () => {
  localStorage.setItem("adminLogedIn", "false");
  window.location.href = "/websitesecurityfinal/index.html";
};

//THIS FUNCTION WILL FETCH ALL THE USERS AND RENDER THEM..
async function renderAllUsers(param, searchData) {
  let userData; // THIS IS AN ARRAY CONTAINING USERS OBJECTS THAT HAS TO BE RENDERED ON SCREEN.

  if (param) {
    // HERE WE ARE FETHING ALL USERS.
    const response = await fetch(
      "https://streetsecurity.herokuapp.com/allusers"
    );
    userData = await response.json();
  } else {
    // HERE ARE ONLY FETCHING SEARCH RESULT USERS.
    userData = searchData.allSearchUsers;
  }
  console.log(userData);

  const tbody = document.querySelector("tbody");
  // SETTING INNER HTML = "" SO THAT WE CAN START NEW EACH TIME THIS FUNCITON IS CALLED.
  tbody.innerHTML = "";

  // THIS WILL RENDER USERS WITH JAVASCRIPT DOM.
  for (let k = 0; k < userData.length; k++) {
    // FINDING USER LAST PAID DATE.
    const duration = window
      .moment()
      .diff(window.moment(userData[k].lastBillPaidDate), "months");

    // CONDITIONAL RENDERING OF IMG TAG DEPENDING ON IF THE USER HAS SUBMIT A RECEIPT
    let image = "";
    if (userData[k].lastBillPaidImage == "noImage") {
      image = `<a>No Bill Paid</a>`;
    } else {
      image = `<a href=${userData[k].lastBillPaidImage} download=${
        "billImageOf" + userData[k].firstName + ".png"
      }>BILL IMAGE</a>`;
    }
    let src =
      userData[k].profile === "noImage" ? "./profile.png" : userData[k].profile;

    // JAVASCIRPT DOM TO RENDER BOOTSTRAP TABLE
    const tr = document.createElement("tr");
    tr.classList.add(userData[k]._id);
    tr.innerHTML = `
            <td >
              <div class="d-flex align-items-center">
              <img
              src=${src}
              alt=""
              style="width: 45px; height: 45px"
              class="rounded-circle"
              />
                <div class="ms-3">
                  <p class="fw-bold mb-1">${userData[k].firstName} ${
      userData[k].lastName
    }</p>
                  <p class="text-muted mb-0">${userData[k].email}</p>
                </div>
              </div>
            </td>
            <td>
              <p class="text-muted mb-0">${userData[k].phone}</p>
              </td>
              <td>${duration} Months</td>
              <td>${userData[k].street}</td>
              <td>
                  <span style="background:${
                    duration > 0 ? "red" : "green"
                  };border-radius:10px;font-size:0.8rem;padding:0.2rem;color:white">${
      duration > 0 ? "NOT PAID" : "PAID"
    }</span>
              </td>
              <td>
                  ${image}
              </td>
            </td>
            `;

    // APPENDING TR INTO TBODY
    tbody.append(tr);
  }

  const searchBtn = document.querySelector(".searchBtn");
  const searchInput = document.querySelector(".searchBar");

  // THIS FUNCTION WILL BE CALLED WHEN YOU SEARCH FOR SPECIFIC USERS.
  searchBtn.onclick = async () => {
    //FETCHING SPECIFIC SEARCH USERS.
    const response = await fetch("https://streetsecurity.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify({
        firstName: searchInput.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const data = await response.json();

    // CALLING THE RENDER FUNCTION AGAIN BUT THIS TIME RENDERING ON SPECIFIC SEARCH USERS.
    renderAllUsers(false, data);

    searchInput.addEventListener("input", function () {
      // THIS WILL CALL RENDER FUNCTION AGAIN WHEN INPUT IS CLEARED OUT.
      if (!this.value) renderAllUsers(true);
    });
  };

  const body = document.querySelector("tbody");
  const trr = body.querySelectorAll("tr");

  for (let i = 0; i < trr.length; i++) {
    trr[i].onclick = () => {
      console.log(trr[i].classList.value);
      window.location.href =
        "/websitesecurityfinal/adminDashboard/singleUser/index.html?id=" +
        trr[i].classList.value;
    };
  }
}

// THIS IS THE MAIN FUNCTION THAT WILL RENDER USERS.
renderAllUsers(true);

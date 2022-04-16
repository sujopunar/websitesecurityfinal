console.log("here");

//GETTING USER ID FROM PARAMS
address = window.location.search;
parameterList = new URLSearchParams(address);
const id = parameterList.get("id");

async function fetchSingleUser() {
  const response = await fetch(
    `https://streetsecurity.herokuapp.com/user/${id}`
  );
  const data = await response.json();

  const profileData = data[0];

  const card = document.querySelector(".profile-card");
  const userCard = document.querySelector(".user-profile-card");
  const bill = document.querySelector(".bill-image");

  card.innerHTML = `
  <img
  src="${
    profileData.profile !== "noImage" ? profileData.profile : "../profile.png"
  }"
  alt="avatar"
  class="profile-image rounded-circle img-fluid"
  style="width: 150px"
/>
<h5 class="my-3">${profileData.firstName}</h5>
<p class="text-muted mb-4">${profileData.street}</p>
<div class="d-flex justify-content-center mb-2">
  <button type="button" class="btn btn-primary reject">Reject</button>
  <button type="button" class="btn btn-outline-primary ms-1 approve">
    Approve
  </button>
</div>
  `;

  userCard.innerHTML = `
  <div class="row">
  <div class="col-sm-3">
    <p class="mb-0">Full Name</p>
  </div>
  <div class="col-sm-9">
    <p class="fullname text-muted mb-0">${
      profileData.firstName + " " + profileData.lastName
    }</p>
  </div>
</div>
<hr />
<div class="row">
  <div class="col-sm-3">
    <p class="mb-0">Email</p>
  </div>
  <div class="col-sm-9">
    <p class="email text-muted mb-0">${
      profileData.email ? profileData.email : "example@example.com"
    }</p>
  </div>
</div>
<hr />
<div class="row">
  <div class="col-sm-3">
    <p class="mb-0">Mobile</p>
  </div>
  <div class="col-sm-9">
    <p class="mobile text-muted mb-0">${
      profileData.phone ? profileData.phone : "(098) 765-4321"
    }</p>
  </div>
</div>
<hr />
<div class="row">
  <div class="col-sm-3">
    <p class="mb-0">Street</p>
  </div>
  <div class="col-sm-9">
    <p class="street text-muted mb-0">${
      profileData.street ? profileData.street : "Bay Area, San Francisco, CA"
    }</p>
  </div>
</div>
  `;

  console.log(profileData);

  if (profileData.lastBillPaidImage !== "noImage") {
    bill.innerHTML = `
  <img
  src="${profileData.lastBillPaidImage}"
  alt="avatar"
  class="profile-image img-fluid"
  style="width: 150px"
/>
  `;
  } else {
    bill.innerHTML = `<p class='text-muted mb-0 ' >No Bill Paid</p>`;
  }

  const downloadBtn = document.querySelector(".download-btn");

  downloadBtn.innerHTML = `
    <a href="${
      profileData.lastBillPaidImage
    }" class="btn btn-outline-primary  w-25 "  download=${
    "billImageOf" + profileData.firstName + ".png"
  }>
    Download Image
    </a>
  `;

  const approve = document.querySelector(".approve");
  const reject = document.querySelector(".reject");
  approve.onclick = async () => {
    const response = await fetch(
      "https://streetsecurity.herokuapp.com/userbill/approval",
      {
        method: "POST",
        body: JSON.stringify({
          userId: profileData._id,
          approved: true,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
  };
  reject.onclick = async () => {
    const response = await fetch(
      "https://streetsecurity.herokuapp.com/userbill/approval",
      {
        method: "POST",
        body: JSON.stringify({
          userId: profileData._id,
          approved: false,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
  };
}

fetchSingleUser();

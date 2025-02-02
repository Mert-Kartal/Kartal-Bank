"use strict";

const userArray = JSON.parse(localStorage.getItem("users"));
console.log(userArray);

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalHeader = document.getElementById("modalHeader");
const showPassword = document.getElementById("showPassword");
const changePassword = document.getElementById("changePassword");
let findUser;
const applyInputMask = (selector) => {
  Inputmask({
    mask: "999999",
    placeholder: "",
  }).mask(document.querySelectorAll(selector));
};

applyInputMask("#password");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();

  if (!usernameValue || !passwordValue) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Invalid data!";
    modalContent.innerHTML = `
    <div class="text-danger">
    <i class="fa-solid fa-circle-xmark fs-1"></i>
    </div>
    Make sure you enter the correct values!`;
  } else {
    findUser = userArray.find((user) => user.username === usernameValue);
    if (!findUser) {
      modalHeader.classList.remove("bg-danger", "bg-success");
      modalHeader.classList.add("bg-danger");
      modalTitle.innerHTML = "Make sure you are registered!";
      modalContent.innerHTML = `
      <div class="text-danger">
      <i class="fa-solid fa-circle-xmark fs-1"></i>
      </div>
      Your account was not found! Make sure you sign up!`;
    } else {
      if (findUser.password !== passwordValue) {
        modalHeader.classList.remove("bg-danger", "bg-success");
        modalHeader.classList.add("bg-danger");
        modalTitle.innerHTML = "Wrong password!";
        modalContent.innerHTML = `
        <div class="text-danger">
        <i class="fa-solid fa-circle-xmark fs-1"></i>
        </div>
        You entered the wrong password! Enter the correct password!`;
      } else {
        modalHeader.classList.remove("bg-danger", "bg-success");
        modalHeader.classList.add("bg-success");
        modalTitle.innerHTML = "Welcome!!";
        modalContent.innerHTML = `
         <div class="text-success">
         <i class="fa fa-check-circle fa-5x mb-4"></i>
         </div>
         You have successfully logged in!`;

        setTimeout(() => {
          window.location.href = `/kartalbank/kartalbank.html?userId=${findUser.id}`;
        }, 2000);
      }
    }
  }
});

showPassword.addEventListener("mouseover", () => {
  password.type = "text";
});

showPassword.addEventListener("mouseout", () => {
  password.type = "password";
});

changePassword.addEventListener("click", () => {
  modalHeader.classList.remove("bg-danger", "bg-success");
  modalHeader.classList.add("bg-secondary");
  modalTitle.innerHTML = "Reset Password!";
  modalContent.innerHTML = `
  <div class="my-3">
  <label for="findUsername" class="form-label">Enter your username</label>
  <input type="text" class="form-control fs-5" id="searchUsername" placeholder="Enter Here!"/>
  </div>
  <button class="btn btn-lg bg-primary text-white" id="searchUser">Search</button>
  `;

  const searchUser = document.getElementById("searchUser");

  searchUser.addEventListener("click", () => {
    const searchUsername = document
      .getElementById("searchUsername")
      .value.trim();
    const findUsername = userArray.find(
      (item) => item.username === searchUsername
    );

    if (!findUsername) {
      modalHeader.classList.remove("bg-danger", "bg-success");
      modalHeader.classList.add("bg-danger");
      modalTitle.innerHTML = "This user does not exist!";
      modalContent.innerHTML = `No account found for this username`;
    } else {
      modalHeader.classList.remove("bg-danger", "bg-success");
      modalHeader.classList.add("bg-success");
      modalTitle.innerHTML = "Password Changed!";
      modalContent.innerHTML = `
        Be careful not to forget your password!
        <input type="text" class="form-control fs-5 my-3" id="lostPassword" placeholder="New password"/>
        <input type="text" class="form-control fs-5 mb-3" id="verifyLostPassword" placeholder="Verify Password"/>
        <button class="btn btn-lg bg-primary text-white" id="restorePassword">Reset!</button>
      `;

      applyInputMask("#lostPassword");
      applyInputMask("#verifyLostPassword");

      const restorePassword = document.getElementById("restorePassword");
      restorePassword.addEventListener("click", () => {
        const lostPassword = document
          .getElementById("lostPassword")
          .value.trim();
        const verifyLostPassword = document
          .getElementById("verifyLostPassword")
          .value.trim();

        if (!lostPassword || !verifyLostPassword) {
          modalHeader.classList.remove("bg-danger", "bg-success");
          modalHeader.classList.add("bg-danger");
          modalTitle.innerHTML = "Error";
          modalContent.innerHTML = `Password fields cannot be empty`;
          return;
        }

        if (lostPassword.length < 6) {
          modalHeader.classList.remove("bg-danger", "bg-success");
          modalHeader.classList.add("bg-danger");
          modalTitle.innerHTML = "Error";
          modalContent.innerHTML = `Password must be at least 6 characters long`;
          return;
        }

        if (lostPassword === findUsername.password) {
          modalHeader.classList.remove("bg-danger", "bg-success");
          modalHeader.classList.add("bg-success");
          modalTitle.innerHTML = "Error";
          modalContent.innerHTML = `Invalid Password`;
        } else {
          if (lostPassword !== verifyLostPassword) {
            modalHeader.classList.remove("bg-danger", "bg-success");
            modalHeader.classList.add("bg-danger");
            modalTitle.innerHTML = "Error";
            modalContent.innerHTML = `Invalid Password`;
          } else {
            findUsername.password = lostPassword;
            localStorage.setItem("users", JSON.stringify(userArray));
            modalHeader.classList.remove("bg-danger", "bg-success");
            modalHeader.classList.add("bg-success");
            modalTitle.innerHTML = "Succesfull!";
            modalContent.innerHTML = `Password Changed`;
          }
        }
      });
    }
  });
});

// localStorage.clear();

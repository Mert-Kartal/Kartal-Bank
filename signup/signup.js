"use strict";
const defaultArray = [
  {
    id: 1,
    username: "johnDoe55",
    password: "123456",
    moneyAmount: 55000,
    loan: 0,
  },
  {
    id: 2,
    username: "janeDoe55",
    password: "654321",
    moneyAmount: 48500,
    loan: 0,
  },
  {
    id: 3,
    username: "bruceWayne",
    password: "303927",
    moneyAmount: 150000,
    loan: 0,
  },
  {
    id: 4,
    username: "peterParker",
    password: "151962",
    moneyAmount: 100,
    loan: 0,
  },
  {
    id: 5,
    username: "tonyStark",
    password: "031963",
    moneyAmount: 100000,
    loan: 0,
  },
  {
    id: 6,
    username: "kavurgaciRaziye",
    password: "741963",
    moneyAmount: 150000,
    loan: 0,
  },
  {
    id: 7,
    username: "kartalMert",
    password: "741963",
    moneyAmount: 100000,
    loan: 0,
  },
];

const userArray = JSON.parse(localStorage.getItem("users")) || [];

defaultArray.forEach((defaultUser) => {
  if (!userArray.some((user) => user.id === defaultUser.id)) {
    userArray.push(defaultUser);
  }
});

localStorage.setItem("users", JSON.stringify(userArray));

console.log(userArray);

const signUpBtn = document.getElementById("signUpBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const verifyPassword = document.getElementById("verifyPassword");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalHeader = document.getElementById("modalHeader");
const showPassword = document.querySelectorAll(".showPassword");

signUpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();
  const verifyPasswordValue = verifyPassword.value.trim();

  if (!usernameValue || !passwordValue || !verifyPasswordValue) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Enter the required information!";
    modalContent.innerHTML = `
    <div class="text-danger">
    <i class="fa-solid fa-circle-xmark fs-1"></i>
    </div>
    Enter your user information!`;
  } else {
    const findUserName = userArray.find(
      (user) => user.username === usernameValue
    );

    if (findUserName) {
      modalHeader.classList.remove("bg-danger", "bg-success");
      modalHeader.classList.add("bg-danger");
      modalTitle.innerHTML = "This username is taken!";
      modalContent.innerHTML = `
      <div class="text-danger">
      <i class="fa-solid fa-circle-xmark fs-1"></i>
      </div>
      There is an account with this username!`;
    } else {
      if (passwordValue === verifyPasswordValue) {
        modalHeader.classList.remove("bg-danger", "bg-success");
        modalHeader.classList.add("bg-success");
        modalTitle.innerHTML = "Account Created!";
        modalContent.innerHTML = `
        <div class="text-success">
        <i class="fa fa-check-circle fa-5x mb-4"></i>
        </div>
        Account succesfully created!`;
        const maxId = userArray.reduce(
          (max, user) => Math.max(max, user.id || 0),
          0
        );
        const newUser = {
          id: maxId + 1,
          username: usernameValue,
          password: passwordValue,
          moneyAmount: 0,
          loan: 0,
        };
        userArray.push(newUser);
        localStorage.setItem("users", JSON.stringify(userArray));

        console.log(JSON.parse(localStorage.getItem("users")));
      } else {
        modalHeader.classList.remove("bg-danger", "bg-success");
        modalHeader.classList.add("bg-danger");
        modalTitle.innerHTML = "Password doesn't match";
        modalContent.innerHTML = `
        <div class="text-danger">
        <i class="fa-solid fa-circle-xmark fs-1"></i>
        </div>
        Make sure you entered your password correctly!`;
      }
    }
  }
});

showPassword.forEach((button, index) => {
  button.addEventListener("mouseover", () => {
    if (index === 0) {
      password.type = "text";
    } else {
      verifyPassword.type = "text";
    }
  });

  button.addEventListener("mouseout", () => {
    if (index === 0) {
      password.type = "password";
    } else {
      verifyPassword.type = "password";
    }
  });
});
// localStorage.clear();

Inputmask({
  mask: "999999",
  placeholder: "",
}).mask("#password, #verifyPassword");

"use strict";

let userArray = JSON.parse(localStorage.getItem("users"));
let loanRequests = JSON.parse(localStorage.getItem("loanRequests")) || [];
const userTransactions = JSON.parse(localStorage.getItem("transactions"));
console.log(userArray);
console.log(userTransactions);
console.log(loanRequests);

const totalUsers = document.getElementById("totalUsers");
const totalBalance = document.getElementById("totalBalance");
const pendingLoans = document.getElementById("pendingLoans");
const renderManageUsers = document.getElementById("renderManageUsers");
const searchUser = document.getElementById("searchmanageUser");
const recentTransactions = document.getElementById("recentTransactions");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalHeader = document.getElementById("modalHeader");
const loanRequestsRender = document.getElementById("loanRequestsRender");
let selectedUserId;

totalUsers.innerHTML = userArray.length;
const totalUserMoney = userArray.reduce(
  (prev, curr) => prev + curr.moneyAmount,
  0
);
console.log(totalUserMoney);

totalBalance.innerHTML = `$${totalUserMoney}`;

pendingLoans.innerHTML = loanRequests.length;

const deleteUserModal = (id) => {
  console.log(id);
  const findUser = userArray.find((user) => user.id === id);
  console.log(findUser);
  selectedUserId = id;
  modalHeader.classList.remove("bg-danger", "bg-success");
  modalHeader.classList.add("bg-danger");
  modalTitle.innerHTML = "Are you sure you want to delete ?!";
  modalContent.innerHTML = `
  ${findUser.username} is about to be deleted are you sure?`;
};

const deleteUser = () => {
  const findUser = userArray.find((user) => user.id === selectedUserId);
  console.log(findUser);
  userArray = userArray.filter((user) => user.id !== findUser.id);
  localStorage.setItem("users", JSON.stringify(userArray));
};

userArray.forEach((user) => {
  renderManageUsers.innerHTML += `
  <tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>$<span class="money">${user.moneyAmount}</span></td>
    <td>
      <a href="/kartalbank/kartalbank.html?userId=${user.id}" class="btn btn-sm btn-primary">View</a>
      <button class="btn btn-sm btn-danger"
      data-bs-toggle="modal"
      data-bs-target=".modal"
      onclick="deleteUserModal(${user.id})"
      >Delete</button>
    </td>
  </tr>
`;
});

searchUser.addEventListener("input", (e) => {
  const searchValue = e.target.value;
  console.log(searchValue);
  renderManageUsers.innerHTML = "";
  const filteredUsers = userArray.filter(
    (user) =>
      user.username.includes(searchValue) ||
      user.id.toString().includes(searchValue)
  );
  filteredUsers.forEach(
    (user) =>
    (renderManageUsers.innerHTML += `
  <tr>
  <td>${user.id}</td>
  <td>${user.username}</td>
  <td>$<span class="money">${user.moneyAmount}</span></td>
  <td>$<span class="money">${user.loan}</span></td>
</tr>
`)
  );
});

userTransactions.forEach((user) => {
  recentTransactions.innerHTML += `
  <tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.type}</td>
    <td>$<span class="money">${user.moneyAmount}</span></td>
    <td>${user.receiver}</td>
  </tr>`;
});

const approveLoan = (id) => {
  const findLoanRequest = loanRequests.find((loan) => loan.id === id);
  if (findLoanRequest) {
    const findUser = userArray.find((user) => user.id === id);
    findUser.loan = Number(findUser.loan) + Number(findLoanRequest.moneyAmount);
    localStorage.setItem("users", JSON.stringify(userArray));
    findLoanRequest.status = "Approved";
    localStorage.setItem("loanRequests", JSON.stringify(loanRequests));
    loanRequests = loanRequests.filter((loan) => loan.id !== id);
    localStorage.setItem("loanRequests", JSON.stringify(loanRequests));
  }
};

const rejectLoan = (id) => {
  const findLoanRequest = loanRequests.find((loan) => loan.id === id);
  if (findLoanRequest) {
    findLoanRequest.status = "Rejected";
    localStorage.setItem("loanRequests", JSON.stringify(loanRequests));
    loanRequests = loanRequests.filter((loan) => loan.id !== id);
    localStorage.setItem("loanRequests", JSON.stringify(loanRequests));
  }
};

loanRequests.forEach((loan) => {
  loanRequestsRender.innerHTML += `
<tr>
  <td>${loan.id}</td>
  <td>${loan.username}</td>
  <td>$<span class="money">${loan.moneyAmount}</span></td>
  <td>${loan.status}</td>
  <td>
    <button class="btn btn-sm btn-success" onclick="approveLoan(${loan.id})">Approve</button>
    <button class="btn btn-sm btn-danger" onclick="rejectLoan(${loan.id})">Reject</button>
  </td>
`;
});


Inputmask({
  alias: "numeric",
  groupSeparator: ",",
  digits: 2,
  digitsOptional: false,
  placeholder: "0",
  rightAlign: false,
  autoUnmask: true,
}).mask(".money");

// localStorage.clear();

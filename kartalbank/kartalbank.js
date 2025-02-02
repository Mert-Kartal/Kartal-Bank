"use strict";

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");
const userArray = JSON.parse(localStorage.getItem("users"));
console.log(userArray);

const userTransactions = JSON.parse(localStorage.getItem("transactions"));
const loanRequests = JSON.parse(localStorage.getItem("loanRequests"));
let transaction;
console.log(userTransactions);
console.log(loanRequests);

const findUser = userArray.find((user) => user.id === Number(userId));
console.log(findUser);

const renderUsername = document.getElementById("renderUsername");
let balance = document.getElementById("balance");
let loan = document.getElementById("loan");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalHeader = document.getElementById("modalHeader");

const withdrawMoney = document.getElementById("withdrawMoney");
const withdrawMoneyBtn = document.getElementById("withdrawMoneyBtn");

const depositMoney = document.getElementById("depositMoney");
const depositMoneyBtn = document.getElementById("depositMoneyBtn");

const recipientUsername = document.getElementById("recipientUsername");
const transferMoney = document.getElementById("transferMoney");
const sendMoneyBtn = document.getElementById("sendMoneyBtn");

const loanMoney = document.getElementById("loanMoney");
const requestLoanBtn = document.getElementById("requestLoanBtn");

renderUsername.innerHTML = `Welcome ${findUser.username}`;
balance.innerHTML = `$${findUser.moneyAmount}`;
loan.innerHTML = `$${findUser.loan}`;

withdrawMoneyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const withdrawMoneyValue = Number(withdrawMoney.value);
  if (Number(findUser.balance) === 0) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Invalid Amount!";
    modalContent.innerHTML = `
    <div class="text-danger">
    <i class="fa-solid fa-circle-xmark fs-1"></i>
    </div>
    Please enter a valid withdrawal amount`;
  }
  if (!withdrawMoney.value || withdrawMoneyValue <= 0) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Invalid Amount!";
    modalContent.innerHTML = `
    <div class="text-danger">
    <i class="fa-solid fa-circle-xmark fs-1"></i>
    </div>
    Please enter a valid withdrawal amount!`;
  } else {
    if (withdrawMoneyValue > findUser.moneyAmount) {
      modalHeader.classList.remove("bg-danger", "bg-success");
      modalHeader.classList.add("bg-danger");
      modalTitle.innerHTML = "Insufficient Funds!";
      modalContent.innerHTML = `
    <div class="text-danger">
    <i class="fa-solid fa-circle-xmark fs-1"></i>
    </div>
    You do not have enough money in your account! You can request a loan!`;
    } else {
      modalHeader.classList.remove("bg-danger", "bg-success");
      modalHeader.classList.add("bg-success");
      modalTitle.innerHTML = "Successful Transaction!";
      modalContent.innerHTML = `
    <div class="text-success">
    <i class="fa fa-check-circle fa-5x mb-4"></i>
    </div>
    You have successfully withdrawn $${withdrawMoneyValue} !`;

      findUser.moneyAmount = Number(findUser.moneyAmount) - withdrawMoneyValue;
      balance.innerHTML = `$${findUser.moneyAmount}`;

      const updateUser = userArray.map((user) =>
        user.id === findUser.id
          ? { ...user, moneyAmount: findUser.moneyAmount }
          : user
      );
      localStorage.setItem("users", JSON.stringify(updateUser));

      transaction = {
        id: findUser.id,
        username: findUser.username,
        type: "Withdraw",
        moneyAmount: withdrawMoneyValue,
        receiver: findUser.username,
      };

      const existingTransactions =
        JSON.parse(localStorage.getItem("transactions")) || [];
      existingTransactions.push(transaction);
      localStorage.setItem(
        "transactions",
        JSON.stringify(existingTransactions)
      );
    }
  }
});

depositMoneyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let depositMoneyValue = Number(depositMoney.value);

  transaction = {
    id: findUser.id,
    username: findUser.username,
    type: "Deposit",
    moneyAmount: depositMoneyValue,
    receiver: findUser.username,
  };

  if (!depositMoney.value || depositMoneyValue <= 0) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Invalid Deposit Amount!";
    modalContent.innerHTML = `
    <div class="text-danger">
      <i class="fa-solid fa-circle-xmark fs-1"></i>
    </div>
    Please enter a valid deposit amount!`;
    return;
  }

  if (Number(findUser.loan) > 0) {
    if (depositMoneyValue > Number(findUser.loan)) {
      depositMoneyValue = depositMoneyValue - Number(findUser.loan);
      findUser.loan = 0;
    } else {
      findUser.loan = Number(findUser.loan) - depositMoneyValue;
      depositMoneyValue = 0;
    }
  }

  findUser.moneyAmount = Number(findUser.moneyAmount) + depositMoneyValue;

  balance.innerHTML = `$${findUser.moneyAmount}`;
  loanMoney.innerHTML = findUser.loan > 0 ? `Kredi: $${findUser.loan}` : "0";

  modalHeader.classList.remove("bg-danger", "bg-success");
  modalHeader.classList.add("bg-success");
  modalTitle.innerHTML = "Deposit Successful!";
  modalContent.innerHTML = `
    <div class="${depositMoneyValue > 0 ? "text-success" : "text-warning"}">
      <i class="fa fa-check-circle fa-5x mb-4"></i>
    </div>
    ${findUser.loan === 0
      ? `Your loan has been fully repaid, and the remaining balance of $${depositMoneyValue} has been added to your account!`
      : `The deposited amount has been deducted from your outstanding loan. Remaining loan balance: $${findUser.loan}`
    }
  `;

  const updateUser = userArray.map((user) =>
    user.id === findUser.id
      ? { ...user, moneyAmount: findUser.moneyAmount, loan: findUser.loan }
      : user
  );
  localStorage.setItem("users", JSON.stringify(updateUser));

  const existingTransactions =
    JSON.parse(localStorage.getItem("transactions")) || [];
  existingTransactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(existingTransactions));
});

sendMoneyBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const transferMoneyValue = Number(transferMoney.value);
  const recipientUsernameValue = recipientUsername.value;

  const recipientUser = userArray.find(
    (user) => user.username === recipientUsernameValue
  );

  if (!recipientUser) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Recipient Not Found!";
    modalContent.innerHTML = `
      <div class="text-danger">
      <i class="fa fa-check-circle fa-5x mb-4"></i>
      </div>
      No user exists with the provided username!`;
    return;
  }

  if (recipientUsernameValue === findUser.username) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Invalid Transaction!";
    modalContent.innerHTML = `
      <div class="text-danger">
      <i class="fa fa-check-circle fa-5x mb-4"></i>
      </div>
      You cannot transfer money to yourself!`;
    return;
  }

  if (isNaN(transferMoneyValue) || transferMoneyValue <= 0) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Invalid Amount!";
    modalContent.innerHTML = `
      <div class="text-danger">
      <i class="fa fa-check-circle fa-5x mb-4"></i>
      </div>
      The transfer amount must be a positive number!`;
    return;
  }

  if (transferMoneyValue > findUser.moneyAmount) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Insufficient Funds!";
    modalContent.innerHTML = `
      <div class="text-danger">
      <i class="fa fa-check-circle fa-5x mb-4"></i>
      </div>
      You do not have enough balance to complete this transaction!`;
    return;
  }

  modalHeader.classList.remove("bg-danger", "bg-success");
  modalHeader.classList.add("bg-success");
  modalTitle.innerHTML = "Transfer Successful!";
  modalContent.innerHTML = `
    <div class="text-success">
    <i class="fa fa-check-circle fa-5x mb-4"></i>
    </div>
    You have successfully transferred $${transferMoneyValue} !`;

  findUser.moneyAmount -= transferMoneyValue;
  recipientUser.moneyAmount += transferMoneyValue;
  balance.innerHTML = `$${findUser.moneyAmount}`;

  const updatedUsers = userArray.map((user) => {
    if (user.id === findUser.id) {
      return { ...user, moneyAmount: findUser.moneyAmount };
    } else if (user.id === recipientUser.id) {
      return { ...user, moneyAmount: recipientUser.moneyAmount };
    }
    return user;
  });
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  transaction = {
    id: findUser.id,
    username: findUser.username,
    type: "SendMoney",
    moneyAmount: transferMoneyValue,
    receiver: recipientUsernameValue,
  };
  const existingTransactions =
    JSON.parse(localStorage.getItem("transactions")) || [];
  existingTransactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(existingTransactions));

  recipientUsername.value = "";
  transferMoney.value = "";
});

requestLoanBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const loanMoneyValue = loanMoney.value;

  if (!loanMoneyValue || loanMoneyValue <= 0) {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = "Invalid Loan Request!";
    modalContent.innerHTML = `
      <div class="text-danger">
        <i class="fa fa-times-circle fa-5x mb-4"></i>
      </div>
      Please enter a valid loan amount.!`;
  } else {
    modalHeader.classList.remove("bg-danger", "bg-success");
    modalHeader.classList.add("bg-success");
    modalTitle.innerHTML = "Processing Request!";
    modalContent.innerHTML = `
      <div class="text-success">
        <i class="fa fa-times-circle fa-5x mb-4"></i>
      </div>
      Your loan request is being processed!`;

    transaction = {
      id: findUser.id,
      username: findUser.username,
      type: "Loan request",
      moneyAmount: loanMoneyValue,
      receiver: findUser.username,
    };

    const loanRequest = {
      id: findUser.id,
      username: findUser.username,
      type: "Loan request",
      status: "Pending",
      moneyAmount: loanMoneyValue,
    };

    const existingTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    existingTransactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(existingTransactions));

    const existingLoans =
      JSON.parse(localStorage.getItem("loanRequests")) || [];
    existingLoans.push(loanRequest);
    localStorage.setItem("loanRequests", JSON.stringify(existingLoans));
  }
});

// localStorage.clear();

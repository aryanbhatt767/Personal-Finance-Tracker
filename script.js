const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const list = document.getElementById("list");
const balance = document.getElementById("balance");

let transactions = [];

// Add Transaction
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);

  addTransactionToDOM(transaction);
  updateBalance();

  text.value = "";
  amount.value = "";
});

// Show Transaction
function addTransactionToDOM(transaction) {
  const li = document.createElement("li");

  li.innerText = `${transaction.text} : ₹${transaction.amount}`;

  list.appendChild(li);
}

// Update Balance
function updateBalance() {
  const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  balance.innerText = total;
}
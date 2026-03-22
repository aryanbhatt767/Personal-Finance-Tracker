const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const list = document.getElementById("list");
const balance = document.getElementById("balance");
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

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
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    amount: +amount.value,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  saveToLocalStorage();

  render();
});

function render() {
  list.innerHTML = "";

  transactions.forEach(t => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${t.type.toUpperCase()} | ${t.category} | ₹${t.amount}
      <button onclick="deleteTransaction(${t.id})">X</button>
    `;

    list.appendChild(li);
  });

  updateBalance();
  updateChart();
  renderBalances();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToLocalStorage();
  render();
}

function updateBalance() {
  let total = 0;

  transactions.forEach(t => {
    if (t.type === "income" || t.type === "borrow") {
      total += t.amount;
    } else {
      total -= t.amount;
    }
  });

  balance.innerText = total;
}

let chart;

function updateChart() {
  const categoryTotals = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: data
      }]
    }
  });
}

function calculateNetBalances() {
  const people = {};

  transactions.forEach(t => {
    if (t.type === "borrow" || t.type === "lend") {
      const name = t.person || "Unknown";

      if (!people[name]) people[name] = 0;

      if (t.type === "borrow") {
        people[name] += t.amount; // they owe you
      } else {
        people[name] -= t.amount; // you owe them
      }
    }
  });

  return people;
}

function renderBalances() {
  const balances = calculateNetBalances();
  const ul = document.getElementById("peopleBalances");

  ul.innerHTML = "";

  for (let person in balances) {
    const li = document.createElement("li");

    const amount = balances[person];

    li.innerText =
      amount > 0
        ? `${person} owes you ₹${amount}`
        : `You owe ${person} ₹${Math.abs(amount)}`;

    ul.appendChild(li);
  }
}

const toggleBtn = document.getElementById("toggleTheme");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark")
    ? "dark"
    : "light";

  localStorage.setItem("theme", theme);
});

render();
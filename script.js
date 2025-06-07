const form = document.getElementById('expense-form');
const expensesList = document.getElementById('expenses-list');
const balancesList = document.getElementById('balances-list');

let expenses = [];

if (localStorage.getItem('expenses')) {
  expenses = JSON.parse(localStorage.getItem('expenses'));
  renderExpenses();
  calculateBalances();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const payer = document.getElementById('payer').value.trim();
  const participants = document.getElementById('participants').value.trim();

  if (!title || !amount || !payer || !participants) {
    alert('Please fill all fields.');
    return;
  }

  const participantsArr = participants.split(',').map(p => p.trim()).filter(p => p);

  expenses.push({ title, amount, payer, participants: participantsArr });
  localStorage.setItem('expenses', JSON.stringify(expenses));

  form.reset();

  renderExpenses();
  calculateBalances();
});

function renderExpenses() {
  expensesList.innerHTML = '';
  expenses.forEach(exp => {
    const li = document.createElement('li');
    li.textContent = `${exp.title}: ₹${exp.amount.toFixed(2)} (Paid by ${exp.payer}, Split among: ${exp.participants.join(', ')})`;
    expensesList.appendChild(li);
  });
}

function calculateBalances() {
  let balances = {};

  expenses.forEach(exp => {
    const share = exp.amount / exp.participants.length;
    exp.participants.forEach(person => {
      if (!balances[person]) balances[person] = 0;
      balances[person] -= share;
    });
    if (!balances[exp.payer]) balances[exp.payer] = 0;
    balances[exp.payer] += exp.amount;
  });

  balancesList.innerHTML = '';
  for (let person in balances) {
    const li = document.createElement('li');
    const bal = balances[person].toFixed(2);
    if (bal > 0) {
      li.textContent = `${person} should receive ₹${bal}`;
      li.style.color = 'green';
    } else if (bal < 0) {
      li.textContent = `${person} owes ₹${Math.abs(bal)}`;
      li.style.color = 'red';
    } else {
      li.textContent = `${person} is settled.`;
      li.style.color = 'gray';
    }
    balancesList.appendChild(li);
  }
}

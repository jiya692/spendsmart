
// Get HTML elements

const expenseForm = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const totalAmount = document.getElementById("totalAmount");
const expenseList = document.getElementById("expenseList");
const categorySummary = document.getElementById("categorySummary");

// Load expenses from Local Storage

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Set today's date

dateInput.value = new Date().toLocaleDateString("en-CA");

// Format amount in PKR

function formatAmount(amount) {
    return "PKR " + amount.toLocaleString("en-PK");
}

// Save expenses in Local Storage

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Add new expense

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (title === "" || amount <= 0 || !category || !date) {
        alert("Please enter valid expense details.");
        return;
    }

    const expense = {
        id: Date.now(),
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(expense);

    saveExpenses();

    displayExpenses();

    expenseForm.reset();

    dateInput.value = new Date().toLocaleDateString("en-CA");

});

// Display all expenses

function displayExpenses() {

    expenseList.innerHTML = "";

    if (expenses.length === 0) {

        expenseList.textContent = "No expenses added yet.";

    } else {

        expenses.forEach(function(expense) {

            const item = document.createElement("div");
            item.className = "expense-item";

            const details = document.createElement("div");

            const heading = document.createElement("h3");
            heading.textContent = expense.title;

            const categoryText = document.createElement("p");
            categoryText.textContent = expense.category;

            const dateText = document.createElement("p");
            dateText.textContent = expense.date;

            details.appendChild(heading);
            details.appendChild(categoryText);
            details.appendChild(dateText);

            const rightSide = document.createElement("div");

            const amountText = document.createElement("p");
            amountText.className = "expense-amount";
            amountText.textContent = formatAmount(expense.amount);

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteExpense(expense.id);
            });

            rightSide.appendChild(amountText);
            rightSide.appendChild(deleteButton);

            item.appendChild(details);
            item.appendChild(rightSide);

            expenseList.appendChild(item);

        });

    }

    calculateTotal();

    displayCategorySummary();

}

// Calculate total expenses

function calculateTotal() {

    let total = 0;

    expenses.forEach(function(expense) {
        total = total + expense.amount;
    });

    totalAmount.textContent = formatAmount(total);

}

// Delete an expense

function deleteExpense(id) {

    expenses = expenses.filter(function(expense) {
        return expense.id !== id;
    });

    saveExpenses();

    displayExpenses();

}

// Display category-wise spending

function displayCategorySummary() {

    categorySummary.innerHTML = "";

    const categories = [
        "Food",
        "Transport",
        "Education",
        "Shopping",
        "Other"
    ];

    if (expenses.length === 0) {

        categorySummary.textContent = "No spending data available.";
        return;

    }

    categories.forEach(function(category) {

        let categoryTotal = 0;

        expenses.forEach(function(expense) {

            if (expense.category === category) {
                categoryTotal = categoryTotal + expense.amount;
            }

        });

        if (categoryTotal > 0) {

            const percentage =
                (categoryTotal / Number(
                    expenses.reduce(function(total, expense) {
                        return total + expense.amount;
                    }, 0)
                )) * 100;

            const categoryItem = document.createElement("div");
            categoryItem.className = "category-item";

            const info = document.createElement("div");
            info.className = "category-info";

            const name = document.createElement("span");
            name.textContent = category;

            const amount = document.createElement("strong");
            amount.textContent = formatAmount(categoryTotal);

            info.appendChild(name);
            info.appendChild(amount);

            const bar = document.createElement("div");
            bar.className = "progress-bar";

            const fill = document.createElement("div");
            fill.className = "progress-fill";
            fill.style.width = percentage + "%";

            bar.appendChild(fill);

            categoryItem.appendChild(info);
            categoryItem.appendChild(bar);

            categorySummary.appendChild(categoryItem);

        }

    });

}

// Display saved expenses when page loads

displayExpenses();

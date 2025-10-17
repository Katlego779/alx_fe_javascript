// Array of quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Add new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();   // update dropdown
  displayRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// Populate category dropdown
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // restore last selected category
  const selectedCategory = localStorage.getItem('selectedCategory') || "all";
  categorySelect.value = selectedCategory;
  filterQuotes();
}

// Filter quotes based on selected category
function filterQuotes() {
  const categorySelect = document.getElementById('categoryFilter');
  const selectedCategory = categorySelect.value;
  localStorage.setItem('selectedCategory', selectedCategory);

  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    quoteDisplay.innerHTML = `"${filtered[randomIndex].text}" — ${filtered[randomIndex].category}`;
  } else {
    quoteDisplay.innerHTML = "No quotes in this category.";
  }
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// On page load
populateCategories();
displayRandomQuote();
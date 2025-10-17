// Array of quote objects
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filtered = filterQuotesArray();
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomQuote = filtered[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Create Add Quote form functionality
function createAddQuoteForm() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const addBtn = document.getElementById('addQuoteBtn');

  addBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
      alert("Please enter both a quote and a category.");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();

    textInput.value = "";
    categoryInput.value = "";
  });
}

// Populate category filter dropdown
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected filter
  const lastFilter = localStorage.getItem("lastFilter") || "all";
  filter.value = lastFilter;
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem("lastFilter", selectedCategory);
  showRandomQuote();
}

// Helper to get filtered array
function filterQuotesArray() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  return selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
}

// Simulate fetching quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // mock API
    const data = await response.json();
    // Convert mock data into quotes
    data.slice(0, 5).forEach(post => {
      quotes.push({ text: post.title, category: "Server" });
    });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    console.log("Fetched quotes from server!");
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
  }
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  createAddQuoteForm();
  showRandomQuote();
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  // Optional: fetch quotes from server every 60s
  setInterval(fetchQuotesFromServer, 60000);
});
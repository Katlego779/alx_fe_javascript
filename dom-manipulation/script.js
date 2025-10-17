// Initial array of quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filtered = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomQuote = filtered[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Add new quote
function createAddQuoteForm() {
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
  populateCategories();
  showRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const currentValue = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore previous selection
  categoryFilter.value = localStorage.getItem('selectedCategory') || 'all';
}

// Filter quotes by category
function getFilteredQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  if (selectedCategory === 'all') return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

function filterQuotes() {
  showRandomQuote();
}

// JSON Export
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from a simulated server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: 'Server'
    }));
    quotes.push(...serverQuotes);
    saveQuotes();
    populateCategories();
    showRandomQuote();
  } catch (error) {
    console.error('Error fetching quotes:', error);
  }
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', createAddQuoteForm);
document.getElementById('exportBtn').addEventListener('click', exportToJsonFile);

// Initialize app
loadQuotes();
populateCategories();
fetchQuotesFromServer();
showRandomQuote();
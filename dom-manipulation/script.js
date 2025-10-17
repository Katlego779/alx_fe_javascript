// --- Quotes array ---
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

// --- Utility functions ---
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function displayRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) return;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomQuote = filtered[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
}

function createAddQuoteForm() {
  const btn = document.getElementById('addQuoteBtn');
  btn.addEventListener('click', addQuote);
}

// --- Add new quote ---
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
  populateCategories();
  displayRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// --- Categories ---
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

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) filter.value = savedCategory;
}

// --- Filter ---
function getFilteredQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

function filterQuotes() {
  displayRandomQuote();
}

// --- JSON import/export ---
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    displayRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Simulate server sync ---
async function syncWithServer() {
  try {
    // Example: fetch from mock API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverData = await response.json();
    
    // Simulate conflict resolution: server overrides
    if (serverData.length > 0) {
      quotes = serverData.slice(0, quotes.length).map((item, i) => ({
        text: quotes[i]?.text || item.title,
        category: quotes[i]?.category || "Server"
      }));
      saveQuotes();
      populateCategories();
      displayRandomQuote();
      console.log("Data synced with server!");
    }
  } catch (err) {
    console.error("Server sync failed:", err);
  }
}

// --- Initialize ---
populateCategories();
createAddQuoteForm();
displayRandomQuote();
setInterval(syncWithServer, 60000); // sync every 60s

// Event listeners
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
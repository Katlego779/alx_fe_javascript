// Quotes array
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

// Display a random quote
function showRandomQuote() {
  const filtered = filterQuotesArray();
  if (!filtered.length) return;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomQuote = filtered[randomIndex];
  document.getElementById('quoteDisplay').innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
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

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Populate categories dropdown
function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const selected = select.value;
  select.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  select.value = selected || localStorage.getItem('lastCategory') || 'all';
}

// Filter quotes
function filterQuotes() {
  localStorage.setItem('lastCategory', document.getElementById('categoryFilter').value);
  showRandomQuote();
}

// Return filtered quotes
function filterQuotesArray() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  return selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
}

// JSON Export
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
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
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(post => ({ text: post.title, category: "Server" }));
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}

// Sync quotes (fetch + post)
async function syncQuotes() {
  const notification = document.getElementById('notification');
  try {
    const serverQuotes = await fetchQuotesFromServer();

    // Conflict resolution: add new quotes from server if not present locally
    serverQuotes.forEach(q => {
      if (!quotes.some(local => local.text === q.text)) quotes.push(q);
    });

    // Post local quotes to server
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes)
    });

    saveQuotes();
    populateCategories();
    showRandomQuote();

    notification.textContent = "Quotes synced with server!";
    setTimeout(() => { notification.textContent = ""; }, 5000);

  } catch (error) {
    console.error("Sync failed:", error);
    notification.textContent = "Failed to sync quotes!";
    setTimeout(() => { notification.textContent = ""; }, 5000);
  }
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', createAddQuoteForm);
document.getElementById('exportBtn').addEventListener('click', exportToJson);
document.getElementById('syncQuotesBtn').addEventListener('click', syncQuotes);

// Initialize
populateCategories();
showRandomQuote();

// Optional: Periodic sync every 60s
setInterval(syncQuotes, 60000);
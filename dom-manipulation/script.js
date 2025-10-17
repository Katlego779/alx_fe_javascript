// ----- QUOTES ARRAY -----
let quotes = [];

// ----- LOAD FROM LOCAL STORAGE -----
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
      { text: "Don’t let yesterday take up too much of today.", category: "Life" }
    ];
  }
}
loadQuotes();

// ----- SAVE TO LOCAL STORAGE -----
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ----- DISPLAY RANDOM QUOTE -----
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filtered = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomQuote = filtered[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// ----- ADD QUOTE -----
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

  // Sync to server
  postQuoteToServer({ text, category });
}

// ----- POPULATE CATEGORIES -----
function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const categories = ['all', ...new Set(quotes.map(q => q.category))];
  filter.innerHTML = '';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected filter
  const lastFilter = localStorage.getItem('lastFilter') || 'all';
  filter.value = lastFilter;
}
populateCategories();

// ----- FILTER QUOTES -----
function filterQuotes() {
  localStorage.setItem('lastFilter', document.getElementById('categoryFilter').value);
  showRandomQuote();
}

// ----- JSON IMPORT -----
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(evt) {
    const importedQuotes = JSON.parse(evt.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// ----- JSON EXPORT -----
document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// ----- POST TO SERVER -----
async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
  } catch (err) {
    console.error('Error posting to server:', err);
  }
}

//
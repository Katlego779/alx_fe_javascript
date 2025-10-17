// ----- QUOTES ARRAY -----
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

// ----- SAVE QUOTES TO LOCAL STORAGE -----
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ----- DISPLAY RANDOM QUOTE -----
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) return;

  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — <strong>${quote.category}</strong>`;
}

// ----- GET FILTERED QUOTES -----
function getFilteredQuotes() {
  const selectedCategory = localStorage.getItem('lastCategory') || 'all';
  if (selectedCategory === 'all') return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

// ----- POPULATE CATEGORIES -----
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem('lastCategory') || 'all';
  categoryFilter.value = lastCategory;
}

// ----- FILTER QUOTES -----
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastCategory', selectedCategory);
  showRandomQuote();
}

// ----- ADD NEW QUOTE -----
function createAddQuoteForm() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();

  // Post to server
  postQuoteToServer(newQuote);

  textInput.value = "";
  categoryInput.value = "";
}

// ----- JSON IMPORT -----
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

// ----- JSON EXPORT -----
document.getElementById('exportQuotesBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
});

// ----- SERVER POST FUNCTION -----
async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    console.log('Quote posted to server:', data);
  } catch (error) {
    console.error('Error posting quote:', error);
  }
}

// ----- EVENT LISTENERS -----
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', createAddQuoteForm);

// ----- INITIALIZATION -----
populateCategories();
showRandomQuote();
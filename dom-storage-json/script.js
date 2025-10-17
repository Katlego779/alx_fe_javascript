// Load quotes from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Create the add quote form functionality
function createAddQuoteForm() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  function addQuote() {
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();
    if (!text || !category) {
      alert("Please enter both a quote and a category.");
      return;
    }
    quotes.push({ text, category });
    saveQuotes();
    showRandomQuote();
    textInput.value = "";
    categoryInput.value = "";
  }

  document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Export quotes to JSON file
document.getElementById('exportBtn').addEventListener('click', function() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize
showRandomQuote();
createAddQuoteForm();

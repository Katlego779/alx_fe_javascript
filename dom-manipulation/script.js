// Load quotes from local storage or initialize default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Don’t let yesterday take up too much of today.", category: "Life" }
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
}

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
}

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
  showRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  
  while (categorySelect.options.length > 1) categorySelect.remove(1);

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  let filtered = quotes;
  if (selected !== 'all') filtered = quotes.filter(q => q.category === selected);

  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "No quotes in this category.";
  } else {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    quoteDisplay.innerHTML = `"${filtered[randomIndex].text}" — ${filtered[randomIndex].category}`;
  }

  localStorage.setItem('lastCategory', selected);
}

function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

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

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', createAddQuoteForm);
document.getElementById('exportBtn').addEventListener('click', exportQuotes);

window.onload = function() {
  populateCategories();
  const lastCat = localStorage.getItem('lastCategory') || 'all';
  document.getElementById('categoryFilter').value = lastCat;
  filterQuotes();
};

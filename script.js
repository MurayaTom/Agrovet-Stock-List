const form = document.getElementById('stockForm');
const tableBody = document.getElementById('tableBody');
const searchBar = document.getElementById('searchBar');
const categoryButtons = document.querySelectorAll('#category-filters button');

let stockList = JSON.parse(localStorage.getItem('stockList')) || [];
let currentFilter = 'All';

// Save to local storage
function saveStock() {
  localStorage.setItem('stockList', JSON.stringify(stockList));
}

// Render stock items based on search and category
function renderTable() {
  const filterText = searchBar.value.toLowerCase();
  tableBody.innerHTML = '';

  stockList.forEach((item, index) => {
    const matchesCategory =
      currentFilter === 'All' || item.category.toLowerCase() === currentFilter.toLowerCase();
    const matchesSearch = item.product.toLowerCase().includes(filterText);

    if (matchesCategory && matchesSearch) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.product}</td>
        <td>${item.category}</td>
        <td>${item.quantityItems}</td>
        <td>${item.quantityWeight}</td>
        <td>${item.price}</td>
        <td><button class="delete-btn" onclick="deleteItem(${index})">Delete</button></td>
      `;
      tableBody.appendChild(row);
    }
  });
}

// Add new stock item
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const product = document.getElementById('product').value.trim();
  const category = document.getElementById('category').value.trim();
  const quantityItems = document.getElementById('quantityItems').value.trim() || '0';
  const quantityWeight = document.getElementById('quantityWeight').value.trim() || '-';
  const price = document.getElementById('price').value.trim();

  if (!product || !category || !price) {
    alert('Please fill out all required fields.');
    return;
  }

  stockList.push({ product, category, quantityItems, quantityWeight, price });
  saveStock();
  form.reset();
  renderTable();
});

// Delete stock item
function deleteItem(index) {
  stockList.splice(index, 1);
  saveStock();
  renderTable();
}

// Listen for category filter click
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.category;
    renderTable();
  });
});

// Listen for search input
searchBar.addEventListener('input', renderTable);

// Initial render
renderTable();

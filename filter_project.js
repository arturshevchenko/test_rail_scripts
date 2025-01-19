name: Filter Projects
description: Filters projects with each letter
author: Artur Shevchenko
version: 1.0
includes: ^dashboard
excludes: 

js:
$(document).ready(
function() {
  // Create and insert the text input element
  const header = document.querySelector('h1.top')
  const searchBar = document.createElement('input')
  searchBar.id = 'searchProjects';
  searchBar.setAttribute('placeholder', 'Filter your projects...')
  searchBar.setAttribute(
      'style',
      'margin-left: 10px; padding-left: 10px; border: 1px solid #003366')
  header.appendChild(searchBar)

  // Listen for user input
  searchBar.addEventListener('input', function() {
    // Get the search text, trimming extra spaces, and make it lowercase
    const filterText = searchBar.value.trim().toLowerCase();

    // Get all the row elements inside <tbody>
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(function(row) {
      const nameTd = row.querySelector('td:nth-child(3) a');
      if (!nameTd) {
        return;
      }
      const projectName = nameTd.textContent.toLowerCase();
      if (projectName.includes(filterText)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});
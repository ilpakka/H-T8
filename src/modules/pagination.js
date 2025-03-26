export function setupPagination() {
  
    const tables = document.querySelectorAll("#resourceTable");

  
    tables.forEach((table) => {
  
      const tbody = table.querySelector("tbody");
      if (!tbody) {
        console.error("Error: Table body (tbody) not found for table", table);
        return;
      }
  
      const tableContainer = table.closest(".table-container");
      if (!tableContainer) {
        console.error("Error: Table container not found for table", table);
        return;
      }
  
      const paginationContainer = tableContainer.querySelector(".pagination");
      const paginationPageNumbers = tableContainer.querySelector(".page-numbers");
      const prevPageBtn = tableContainer.querySelector(".prev-page");
      const nextPageBtn = tableContainer.querySelector(".next-page");
  
      if (!paginationContainer || !paginationPageNumbers || !prevPageBtn || !nextPageBtn) {
        console.error("Error: Pagination elements not found for table", table);
        return;
      }
  
      const rowsPerPage = 10;
      let currentPage = 1;
      const totalRows = tbody.rows.length;
      const totalPages = Math.ceil(totalRows / rowsPerPage);
  
      function renderTable() {
  
        // Hide all rows
        for (let i = 0; i < totalRows; i++) {
          tbody.rows[i].style.display = "none";
        }
  
        // Show rows for the current page
        const start = (currentPage - 1) * rowsPerPage;
        const end = Math.min(start + rowsPerPage, totalRows);
  
        for (let i = start; i < end; i++) {
          tbody.rows[i].style.display = "table-row";
        }
  
        // Update pagination buttons
        renderPagination();
      }
  
      function renderPagination() {
  
        paginationPageNumbers.innerHTML = ""; // Clear pagination buttons
  
        // Hide the entire pagination container if there is only one page
        if (totalPages <= 1) {
          paginationContainer.style.display = "none";
          return;
        } else {
          paginationContainer.style.display = "flex"; // Ensure pagination is visible if there are multiple pages
        }
  
        // Create page number buttons
        for (let i = 1; i <= totalPages; i++) {
          const start = (i - 1) * rowsPerPage;
  
          // Only add buttons for pages with content
          if (start < totalRows) {
            const button = document.createElement("button");
            button.classList.add("page-number");
            button.textContent = i;
  
            // Highlight the active page
            if (i === currentPage) {
              button.classList.add("active");
            }
  
            button.addEventListener("click", () => {
              currentPage = i;
              renderTable();
            });
  
            paginationPageNumbers.appendChild(button);
          }
        }
  
        // Enable/disable prev and next buttons based on the current page
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
      }
  
      // Event listeners for prev and next buttons
      prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });
  
      nextPageBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      });
  
      // Initial render
      renderTable();
    });
  }
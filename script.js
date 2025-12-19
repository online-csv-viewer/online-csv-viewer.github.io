document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('csvFileInput');
    const tableWrapper = document.getElementById('table-wrapper');
    const placeholder = document.getElementById('placeholder');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true, // Assumes first row is header. Set to false if not guaranteed.
            skipEmptyLines: true,
            complete: function(results) {
                renderTable(results.data, results.meta.fields);
            },
            error: function(error) {
                console.error("Error parsing CSV:", error);
                alert("Error parsing CSV file.");
            }
        });
    });

    function renderTable(data, headers) {
        if (!data || data.length === 0) {
            alert("No data found in CSV.");
            return;
        }

        // Clear previous content
        tableWrapper.innerHTML = '';
        
        // Hide placeholder, show table
        placeholder.classList.add('hidden');
        tableWrapper.classList.remove('hidden');

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create Header Row
        const headerRow = document.createElement('tr');
        
        // Add Row Number Header
        const rowNumHeader = document.createElement('th');
        rowNumHeader.textContent = "#";
        rowNumHeader.classList.add('row-num'); // Add class for styling
        headerRow.appendChild(rowNumHeader);

        // If PapaParse didn't detect headers (e.g. header: false), we might need to handle array of arrays.
        // However, we used header: true. 'headers' might be undefined if the CSV is weird, 
        // so we fallback to Object.keys of the first row if needed.
        const columns = headers || Object.keys(data[0]);

        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create Data Rows
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            // Add Row Number Cell
            const rowNumCell = document.createElement('td');
            rowNumCell.textContent = index + 1;
            rowNumCell.classList.add('row-num'); // Add class for styling
            tr.appendChild(rowNumCell);

            columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[col] || ''; // Handle missing values
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
    }
});

/**
 * Export utilities for CSV and PDF generation
 */

/**
 * Convert data array to CSV format
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  });
  
  // Create blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export table data to CSV
 */
export function exportTableToCSV(tableElement, filename = 'table-export.csv') {
  const rows = [];
  const headers = [];
  
  // Get headers from thead
  const thead = tableElement.querySelector('thead');
  if (thead) {
    const headerRow = thead.querySelector('tr');
    if (headerRow) {
      headerRow.querySelectorAll('th').forEach(th => {
        headers.push(th.textContent.trim());
      });
    }
  }
  
  // Get data rows from tbody
  const tbody = tableElement.querySelector('tbody');
  if (tbody) {
    tbody.querySelectorAll('tr').forEach(tr => {
      const row = [];
      tr.querySelectorAll('td').forEach((td, index) => {
        // Extract text, handling nested elements
        let text = td.textContent.trim();
        // Remove extra whitespace
        text = text.replace(/\s+/g, ' ');
        row.push(text);
      });
      rows.push(row);
    });
  }
  
  // Create CSV
  const csvRows = [];
  if (headers.length > 0) {
    csvRows.push(headers.join(','));
  }
  rows.forEach(row => {
    csvRows.push(row.map(cell => {
      // Escape values containing commas or quotes
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(','));
  });
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export to PDF using window.print() approach
 * For more advanced PDF generation, consider using jsPDF or similar library
 */
export function exportToPDF(elementId, filename = 'export.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export');
    return;
  }
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  // Get styles
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(style => style.outerHTML)
    .join('\n');
  
  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename.replace('.pdf', '')}</title>
        <style>
          @media print {
            @page {
              margin: 1cm;
            }
            body {
              margin: 0;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
          }
        </style>
        ${styles}
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Optionally close after printing
      // printWindow.close();
    }, 250);
  };
}

/**
 * Export chart/image to PNG (using html2canvas if available)
 */
export async function exportChartToPNG(elementId, filename = 'chart-export.png') {
  try {
    // Check if html2canvas is available (would need to be installed)
    // For now, we'll use a simpler approach with canvas if possible
    console.warn('PNG export requires html2canvas library. Using print approach instead.');
    exportToPDF(elementId, filename.replace('.png', '.pdf'));
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    exportToPDF(elementId, filename.replace('.png', '.pdf'));
  }
}

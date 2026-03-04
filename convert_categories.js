const XLSX = require('xlsx');
const fs = require('fs');

// Load Excel file
const workbook = XLSX.readFile('categories.xlsx');

// Get first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert sheet to JSON
const data = XLSX.utils.sheet_to_json(sheet);

// Optional: map fields to your desired keys
const jsonData = data.map(row => ({
  order: row.Order,
  category: row.Category,
  arabic_category: row.Arabic_Category
}));

// Save as JSON
fs.writeFileSync('categories.json', JSON.stringify(jsonData, null, 2), 'utf8');

console.log('categories.json created from Excel successfully!');
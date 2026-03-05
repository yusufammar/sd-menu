const XLSX = require("xlsx");
const fs = require("fs");

// Load Excel file
const workbook = XLSX.readFile("items.xlsx");

// Get first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert sheet to JSON rows
const rows = XLSX.utils.sheet_to_json(sheet);

// Object to group categories
const grouped = {};

// Loop through rows
rows.forEach(row => {

  const mainCategory = row["Category"];
  const subCategory = row["Subcategory"];

  const key = `${mainCategory}__${subCategory}`;

  if (!grouped[key]) {
    grouped[key] = {
      category: mainCategory,
      sub_category: subCategory,
      items: []
    };
  }

  grouped[key].items.push({
    name: row["Name"],                     // using image column as name
    arabic_name: row["Arabic_Name"],
    image: row["Image"],
    price: row["Price"],
    description: row["Description"],
    arabic_description: row["Arabic_Description"],
    kcal: row["Kcal"]
  });

});

// Convert grouped object to array
const result = Object.values(grouped);

// Save JSON
fs.writeFileSync(
  "menu.json",
  JSON.stringify(result, null, 2),
  "utf8"
);

console.log("✅ menu.json generated successfully!");
const XLSX = require("xlsx");
const fs = require("fs");

// Read Excel file
const workbook = XLSX.readFile("items.xlsx");

// Get first sheet name
const sheetName = workbook.SheetNames[0];

// Convert sheet to JSON
const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
  defval: ""
});

// Transform to required grouped format
const grouped = sheet.reduce((acc, row) => {
  const categoryName = row.Category?.trim();
  const itemName = row.Name?.trim();
  const itemPrice = row.Price?.toString().replace("SAR", "SR").trim();

  if (!categoryName) return acc;

  // Check if category already exists
  let category = acc.find(c => c.category === categoryName);

  if (!category) {
    category = {
      category: categoryName,
      items: []
    };
    acc.push(category);
  }

  category.items.push({
    name: itemName,
    price: itemPrice,
    image: row.Image.trim(),
    description: row.Description.trim(),
    arabic_name: row.Arabic_Name.trim(),
    arabic_description: row.Arabic_Description.trim()

  });

  return acc;
}, []);

// Write to JSON file
fs.writeFileSync("menu.json", JSON.stringify(grouped, null, 2));

console.log("✅ Conversion completed!");